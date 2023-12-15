import { Env, getEnv } from '../../../util/utils';

const PLEASE_URL = getEnv() === Env.Prod ? 'please.nav.no' : 'please.ekstern.dev.nav.no';
const ticketUrl = `/please/ws-auth-ticket`;
const socketUrl = `ws://${PLEASE_URL}/ws`;

enum EventTypes {
	NY_MELDING = 'NY_DIALOGMELDING_FRA_BRUKER_TIL_NAV'
}

enum ReadyState {
	CONNECTING = 0,
	OPEN = 1,
	CLOSING = 2,
	CLOSED = 3
}

const handleMessage = (callback: () => void) => (event: MessageEvent) => {
	if (event.data === 'AUTHENTICATED') return;
	const message = JSON.parse(event.data);
	if (message !== EventTypes.NY_MELDING) return;
	callback();
};

const sendTicketWhenOpen = (socket: WebSocket, ticket: string) => {
	const sendTicket = () => socket.send(ticket);
	if (socket?.readyState === ReadyState.OPEN) {
		sendTicket();
	} else {
		socket.onopen = sendTicket;
	}
};

const authorize = (socket: WebSocket, body: SubscriptionPayload, callback: () => void) => {
	if (ticketSigleton) {
		sendTicketWhenOpen(socket, ticketSigleton);
	}

	fetch(ticketUrl, {
		body: JSON.stringify(body),
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	})
		.then(response => {
			if (!response.ok) throw Error('Failed to fetch ticket for websocket');
			return response.text();
		})
		.then(ticket => {
			ticketSigleton = ticket;
			sendTicketWhenOpen(socket, ticket);
			socket.onmessage = handleMessage(callback);
			socket.onclose = handleClose(body, callback);
		});
};

const maxRetries = 10;
let retries = 0;
const handleClose = (body: SubscriptionPayload, callback: () => void) => (event: CloseEvent) => {
	if (retries >= maxRetries) return;
	retries++;
	setTimeout(() => {
		socketSingleton?.close();
		socketSingleton = new WebSocket(socketUrl);
		authorize(socketSingleton, body, callback);
	}, 1000);
};

let socketSingleton: WebSocket | undefined;
let ticketSigleton: string | undefined;
interface SubscriptionPayload {
	subscriptionKey: string;
}
export const listenForNyDialogEvents = (callback: () => void, fnr?: string) => {
	// Start with only internal
	if (!fnr) return;
	const body = { subscriptionKey: fnr };
	if (socketSingleton === undefined || ![ReadyState.OPEN, ReadyState.CONNECTING].includes(socket.readyState)) {
		socketSingleton = new WebSocket(socketUrl);
		authorize(socketSingleton, body, callback);
	}
	return () => {
		if (socketSingleton) {
			// Clear reconnect try on intentional close
			// tslint:disable-next-line:no-empty
			socketSingleton.onmessage = () => {};
			socketSingleton.close();
		}
	};
};
