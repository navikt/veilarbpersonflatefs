import { useEffect } from 'react';

export function erMock() {
	return import.meta.env.MODE === 'development';
}

export enum Env {
	Local = 'local',
	Dev = 'dev',
	Prod = 'prod'
}

export const getEnv = (): Env => {
	const { hostname } = window.location;
	if (hostname.includes('intern.dev.nav.no')) return Env.Dev;
	if (hostname.includes('intern.nav.no')) return Env.Prod;
	return Env.Local;
};

export function useEventListener(name: string, listener: (event: Event) => void) {
	useEffect(() => {
		window.addEventListener(name, listener);
		return () => window.removeEventListener(name, listener);
	}, [listener, name]);
}
