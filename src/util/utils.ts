import { useCallback, useEffect } from 'react';

export function erMock() {
	return import.meta.env.MODE === 'development';
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
