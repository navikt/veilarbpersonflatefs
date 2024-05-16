import { Env, erMock, getEnv } from './utils';

export const hasHashParam = (parameterName: string): boolean => {
	return window.location.hash.includes(parameterName);
};

export const hasQueryParam = (parameterName: string): boolean => {
	return window.location.search.includes(parameterName);
};

const DEV_DOMAINS = ['dev', 'localhost'];

export const erITestMiljo = (): boolean => {
	return window.location.hostname.split('.').findIndex(domain => DEV_DOMAINS.includes(domain)) >= 0;
};

export const utledSpaUrl = (appName: string): string => {
	const hostnameParts = window.location.hostname.split('.');
	const topLevelDomain = hostnameParts.slice(-(hostnameParts.length - 1)).join('.');
	return `${window.location.protocol}//${appName}.${topLevelDomain}`;
};

export const utledCDNSpaUrl = (teamName: string, appName: string) => {
	const miljo = getEnv() === Env.Prod ? 'prod' : 'dev';
	return `https://cdn.nav.no/${teamName}/${appName}-${miljo}`;
};

export const loginUrl = () => {
	if (erMock()) {
		return `${window.location.href}`;
	}
	return `${window.location.origin}/oauth2/login?redirect=${window.location.href}`;
};
