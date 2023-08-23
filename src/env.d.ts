interface ImportMetaEnv {
	readonly MODE: string;
	readonly BASE_URL: string;
	readonly DEV: boolean;
	readonly PROD: boolean;
	readonly SSR: boolean;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	veilarbpersonflatefsAmplitude: ({
		origin,
		eventName,
		eventData
	}?: {
		origin: string;
		eventName: string;
		eventData?: Record<string, unknown>;
	}) => Promise<void>;
}
