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

interface SubscriptionPayload {
	subscriptionKey: string;
}

let socketSingleton: WebSocket | undefined;
let ticketSingleton: { ticket: string; fnr: string } | undefined;

const handleMessage = (callback: () => void, body: SubscriptionPayload) => (event: MessageEvent) => {
	if (event.data === 'AUTHENTICATED') return;
	if (event.data === 'INVALID_TOKEN' && socketSingleton) {
		ticketSingleton = undefined;
		getTicketAndAuthenticate(body);
		return;
	}
	const message = JSON.parse(event.data);
	if (message !== EventTypes.NY_MELDING) return;
	callback();
};

const maxRetries = 10;
let retries = 0;
const handleClose = (callback: () => void, body: SubscriptionPayload) => (event: CloseEvent) => {
	if (retries >= maxRetries) return;
	retries++;
	setTimeout(() => {
		socketSingleton?.close();
		reconnectWebsocket(callback, body);
		getTicketAndAuthenticate(body);
	}, 1000);
};

const sendTicketWhenOpen = (socket: WebSocket, ticket: string) => {
	const sendTicket = () => socket.send(ticket);
	if (socket?.readyState === ReadyState.OPEN) {
		sendTicket();
	} else {
		socket.onopen = sendTicket;
	}
};

const getTicket = (body: SubscriptionPayload): Promise<string> => {
	if (ticketSingleton && ticketSingleton.fnr === body.subscriptionKey) return Promise.resolve(ticketSingleton.ticket);
	return fetch(ticketUrl, {
		body: JSON.stringify(body),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Nav-Consumer-Id': 'veilarbpersonflate'
		}
	})
		.then(response => {
			if (!response.ok) throw Error('Failed to fetch ticket for websocket');
			return response.text();
		})
		.then(ticket => {
			ticketSingleton = { ticket, fnr: body.subscriptionKey };
			return ticket;
		});
};

const authenticate = (socket: WebSocket, ticket: string) => {
	sendTicketWhenOpen(socket, ticket);
};

const getTicketAndAuthenticate = async (body: SubscriptionPayload) => {
	const ticket = await getTicket(body);
	if (!socketSingleton) return;
	authenticate(socketSingleton, ticket);
};

const reconnectWebsocket = (callback: () => void, body: SubscriptionPayload) => {
	const socket = new WebSocket(socketUrl);
	socketSingleton = socket;
	socketSingleton.onmessage = handleMessage(callback, body);
	socketSingleton.onclose = handleClose(callback, body);
	return socket;
};

export const listenForNyDialogEvents = (callback: () => void, fnr?: string) => {
	// Start with only internal
	if (!fnr) return;
	const currentReadyState = socketSingleton?.readyState;
	const body = { subscriptionKey: fnr, events: [EventTypes.NY_MELDING] };
	if (
		socketSingleton === undefined ||
		![ReadyState.OPEN, ReadyState.CONNECTING].includes(socketSingleton.readyState)
	) {
		reconnectWebsocket(callback, body);
		getTicketAndAuthenticate(body);
	}
	return () => {
		if (currentReadyState === ReadyState.CLOSING) return;
		if (socketSingleton) {
			// Clear reconnect try on intentional close
			socketSingleton.onclose = () => {};
			socketSingleton.close();
		}
	};
};
