const timeoutMs = 5000;
const waitForUmamiToAppearOnWindow = new Promise<void>((resolve, reject) => {
	if (window.umami) return resolve();

	let interval: NodeJS.Timeout | undefined;
	let timeout: NodeJS.Timeout | undefined;

	timeout = setTimeout(() => {
		clearInterval(interval);
		clearTimeout(timeout);
		reject(new Error(`Fant ikke Umami på window innen ${timeoutMs} ms`));
	}, timeoutMs);
	interval = setInterval(() => {
		if (window.umami) {
			clearInterval(interval);
			clearTimeout(timeout);
			resolve();
		}
	});
});

declare global {
	interface Window {
		umami: {
			track: (eventName: string, data: Record<string, any>) => Promise<void>;
		} | null;
	}
}

let track: (eventName: string, eventData: Record<string, any>) => void | undefined;

export async function initAnalytics() {
	waitForUmamiToAppearOnWindow
		.then(() => {
			track = (eventName: string, eventData: Record<string, any>) => {
				window.umami!.track(eventName, eventData);
			};
		})
		.catch((e: Error) => {
			// tslint:disable-next-line:no-console
			console.error(`Unexpected error when initializing Umami: ${e.message}`, e);
		});
}

export async function logAnalyticsEvent(
	eventName: string,
	eventData?: Record<string, unknown>,
	origin = 'veilarbpersonflatefs'
): Promise<void> {
	try {
		track(eventName, { ...eventData, app: origin });
	} catch (e) {
		return Promise.reject(`Unexpected Umami error: ${e}`);
	}
}
