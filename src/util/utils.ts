import { useEffect } from 'react';

export function erMock() {
	return import.meta.env.MODE === 'development';
}

interface EnvConfig {
	ingressType: 'ansatt' | 'intern';
	type: EnvType;
}

export enum EnvType {
	prod = 'prod',
	dev = 'dev',
	local = 'local'
}

const Env = {
	ansattDev: { ingressType: 'ansatt', type: EnvType.dev },
	dev: { ingressType: 'intern', type: EnvType.dev },
	prod: { ingressType: 'intern', type: EnvType.prod },
	local: { ingressType: 'intern', type: EnvType.local }
} as const;

export const getEnv = (): EnvConfig => {
	const { hostname } = window.location;
	if (hostname.includes('intern.dev.nav.no')) return Env.dev;
	if (hostname.includes('ansatt.dev.nav.no')) return Env.ansattDev;
	if (hostname.includes('intern.nav.no')) return Env.prod;
	return Env.local;
};

export function useEventListener(name: string, listener: (event: Event) => void) {
	useEffect(() => {
		window.addEventListener(name, listener);
		return () => window.removeEventListener(name, listener);
	}, [listener, name]);
}

export function dispatchNavigateEvent(path: string) {
	window.history.pushState(null, '', path);
	window.dispatchEvent(new CustomEvent('veilarbpersonflate.navigate'));
}
