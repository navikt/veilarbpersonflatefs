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

const maxRetries = 10;
let retries = 0;
const handleClose = (event: CloseEvent) => {
	if (retries >= maxRetries) return;
	retries++;
	socket = new WebSocket(socketUrl);
};

let socket: WebSocket | undefined = undefined;
export const listenForNyDialogEvents = (callback: () => void, fnr?: string) => {
	// Start with only internal
	if (!fnr) return;
	const body = { subscriptionKey: fnr };
	if (socket === undefined || ![ReadyState.OPEN, ReadyState.CONNECTING].includes(socket.readyState)) {
		socket = new WebSocket(socketUrl);
	}

	fetch(ticketUrl, { body: JSON.stringify(body), method: 'POST', headers: { 'Content-Type': 'application/json' } })
		.then(response => {
			if (!response.ok) throw Error('Failed to fetch ticket for websocket');
			return response.text();
		})
		.then(ticket => {
			// If ready state is OPEN (1)
			if (socket?.readyState === ReadyState.OPEN) {
				socket.send(ticket);
			} else {
				socket?.addEventListener('open', () => {
					socket?.send(ticket);
				});
			}
			if (socket) {
				socket.onmessage = handleMessage(callback);
				socket.onclose = handleClose;
			}
		});
	return () => {
		if (socket) {
			socket.close();
		}
	};
};
