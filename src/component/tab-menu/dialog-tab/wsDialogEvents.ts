import { EnvType, getEnv } from '../../../util/utils';

const PLEASE_URL = getEnv().type === EnvType.prod ? 'please.nav.no' : 'please.ekstern.dev.nav.no';
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
	subscriptionKey: SubscriptionKey;
}

type Ticket = string & { _brand: 'Ticket' };
type SubscriptionKey = string & { _brand: 'SubscriptionKey' };
const ticketCache: Map<SubscriptionKey, Ticket> = new Map(); // { ticket: string; fnr: string } | undefined;

const handleMessage = (callback: () => void, body: SubscriptionPayload, socket: WebSocket) => (event: MessageEvent) => {
	switch (event.data) {
		case 'AUTHENTICATED':
			ticketCache.delete(body.subscriptionKey);
			return;
		case 'INVALID_TOKEN':
			ticketCache.delete(body.subscriptionKey);
			getTicketAndAuthenticate(body, socket);
			return;
		default:
			const message = JSON.parse(event.data);
			if (message === EventTypes.NY_MELDING) {
				callback();
			}
	}
};

const maxRetries = 10;
let retries = 0;
const handleClose = (callback: () => void, body: SubscriptionPayload, socket: WebSocket) => (event: CloseEvent) => {
	ticketCache.delete(body.subscriptionKey);
	if (retries >= maxRetries) return;
	retries++;
	setTimeout(() => {
		socket?.close();
		const newSocket = connectNewWebsocket(callback, body);
		getTicketAndAuthenticate(body, newSocket);
	}, 1000);
};

const getTicket = (body: SubscriptionPayload): Promise<string> => {
	const cachedTicket = ticketCache.get(body.subscriptionKey);
	if (cachedTicket) return Promise.resolve(cachedTicket);
	return fetch(ticketUrl, {
		body: JSON.stringify(body),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Nav-Consumer-Id': 'veilarbpersonflate'
		}
	})
		.then(response => {
			if (!response.ok) throw Error(`Failed to fetch ticket for websocket ${response.status}`);
			return response.text();
		})
		.then(ticket => {
			ticketCache.set(body.subscriptionKey, ticket as Ticket);
			return ticket;
		});
};

const getTicketAndAuthenticate = async (body: SubscriptionPayload, socket: WebSocket) => {
	const ticket = await getTicket(body);
	const sendTicket = () => socket.send(ticket);
	if (socket?.readyState === ReadyState.OPEN) {
		sendTicket();
	} else {
		socket.onopen = sendTicket;
	}
};

const connectNewWebsocket = (callback: () => void, body: SubscriptionPayload) => {
	const socket = new WebSocket(socketUrl);
	socket.onmessage = handleMessage(callback, body, socket);
	socket.onclose = handleClose(callback, body, socket);
	return socket;
};

const isClosedOrClosing = (readyState: ReadyState) => ![ReadyState.OPEN, ReadyState.CONNECTING].includes(readyState);

let socketSingleton: WebSocket | undefined;
export const listenForNyDialogEvents = (callback: () => void, fnr?: string) => {
	// Start with only internal
	if (!fnr) return;
	if (socketSingleton === undefined || isClosedOrClosing(socketSingleton.readyState)) {
		const body = { subscriptionKey: fnr as SubscriptionKey, events: [EventTypes.NY_MELDING] };
		socketSingleton = connectNewWebsocket(callback, body);
		getTicketAndAuthenticate(body, socketSingleton);
	}
	return () => {
		if (socketSingleton?.readyState === ReadyState.CLOSING) return;
		if (socketSingleton) {
			// Clear reconnect try on intentional close
			socketSingleton.onclose = () => {};
			socketSingleton.close();
		}
	};
};
