import { useCallback, useEffect } from 'react';

export function erDev() {
	const host: string = window.location.host;
	const devMode: boolean = window.location.search.includes('devmode');

	return host.includes('localhost') || host.includes('127.0.0.1') || devMode;
}

export function hasStored(tagName: string) {
	return window.localStorage.getItem(tagName) !== null;
}

export function useEventListener(name: string, listener: (event: Event) => void) {
	const callback = useCallback(listener, []);

	useEffect(() => {
		window.addEventListener(name, callback);
		return () => window.removeEventListener(name, callback);
	}, [callback, name]);
}
