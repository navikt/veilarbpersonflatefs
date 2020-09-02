import { useCallback, useEffect } from 'react';

export function erDev() {
	const host: string = window.location.host;
	const devMode: boolean = window.location.search.includes('devmode');

	return host.includes('localhost') || host.includes('127.0.0.1') || devMode;
}

export function hasStored(tagName: string) {
	return window.localStorage.getItem(tagName) !== null;
}

export function useEventListener(name: string, listener: (event: CustomEvent) => void) {
	const callback = useCallback(
		(event: Event) => {
			if (event && 'detail' in event) {
				return listener(event as CustomEvent);
			}
		},
		[listener]
	);

	useEffect(() => {
		window.addEventListener(name, callback);
		return () => window.removeEventListener(name, callback);
	}, [callback, name]);
}
