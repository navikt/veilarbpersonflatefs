export enum EnhetConnectionState {
    CONNECTED = 'connected',
    NOT_CONNECTED = 'not_connected',
    FAILED = 'failed'
}

enum EventMessages {
    ESTABLISHED = 'Connection Established',
    PING = 'ping!',
    NY_AKTIV_ENHET = 'NY_AKTIV_ENHET',
    NY_AKTIV_BRUKER = 'NY_AKTIV_BRUKER',
}

export enum EnhetContextEventNames {
    CONNECTION_STATE_CHANGED = 'connection_state_changed',
    NY_AKTIV_ENHET = 'ny_aktiv_enhet',
    NY_AKTIV_BRUKER = 'ny_aktiv_bruker'
}

interface ConnectionStateChanged {
    type: EnhetContextEventNames.CONNECTION_STATE_CHANGED;
    state: EnhetConnectionState;
}

interface NyContext {
    type: EnhetContextEventNames.NY_AKTIV_ENHET | EnhetContextEventNames.NY_AKTIV_BRUKER;
}

export type EnhetContextEvent = ConnectionStateChanged | NyContext;

export default class EnhetContextListener {
    connection: WebSocket;
    connectionState: EnhetConnectionState;
    callback: (event: EnhetContextEvent) => void;
    closing: boolean = false;
    retryTimeout: number;
    hearthbeatInterval: number;

    constructor(uri: string, cb: (action: EnhetContextEvent) => void) {
        this.callback = cb;
        this.lagWebSocketConnection(uri);
    }

    public close() {
        this.closing = true;
        clearTimeout(this.retryTimeout);
        clearInterval(this.hearthbeatInterval);
        this.connection.close();
    }

    private lagWebSocketConnection(uri: string) {
        if (this.closing) {
            return;
        }

        this.connection = new WebSocket(uri);

        this.connection.onopen = (e) => {
            this.connection.send('Hello, World!');
            this.hearthbeatInterval = window.setInterval(() => {
                this.connection.send('Hello, World!');
            }, 30000);
        };

        this.connection.onmessage = (e: MessageEvent) => {
            if (e.data === EventMessages.ESTABLISHED || e.data === EventMessages.PING) {
                this.connectionState = EnhetConnectionState.CONNECTED;
                this.callback({ type: EnhetContextEventNames.CONNECTION_STATE_CHANGED, state: EnhetConnectionState.CONNECTED });
            } else if(e.data === EventMessages.NY_AKTIV_ENHET) {
                this.callback({ type: EnhetContextEventNames.NY_AKTIV_ENHET });
            } else if(e.data === EventMessages.NY_AKTIV_BRUKER) {
                this.callback({ type: EnhetContextEventNames.NY_AKTIV_BRUKER });
            }
        };

        this.connection.onerror = (e: ErrorEvent) => {
            this.connectionState = EnhetConnectionState.FAILED;
            this.callback({ type: EnhetContextEventNames.CONNECTION_STATE_CHANGED, state: EnhetConnectionState.FAILED });
        };

        this.connection.onclose = () => {
            clearInterval(this.hearthbeatInterval);
            if (!this.closing) {
                this.connectionState = EnhetConnectionState.FAILED;
                this.callback({ type: EnhetContextEventNames.CONNECTION_STATE_CHANGED, state: EnhetConnectionState.FAILED });
                this.retryTimeout = window.setTimeout(() => this.lagWebSocketConnection(uri), 1000);
            } else {
                this.connectionState = EnhetConnectionState.NOT_CONNECTED;
                this.callback({ type: EnhetContextEventNames.CONNECTION_STATE_CHANGED, state: EnhetConnectionState.NOT_CONNECTED });
            }
        };
    }
}
