import { useCallback, useEffect } from 'react';

export function erMock() {
	return import.meta.env.MODE === 'development';
}

export enum Env {
	Local = 'local',
	Dev = 'dev',
	Prod = 'prod'
}

export const getEnv = (): string => {
	const { hostname } = window.location;
	if (hostname.includes('dev.intern.nav.no')) return Env.Dev;
	if (hostname.includes('intern.nav.no')) return Env.Prod;
	return Env.Local;
};

export function useEventListener(name: string, listener: (event: Event) => void) {
	const callback = useCallback(listener, []);

	useEffect(() => {
		window.addEventListener(name, callback);
		return () => window.removeEventListener(name, callback);
	}, [callback, name]);
}
