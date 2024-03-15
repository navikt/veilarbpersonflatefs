import { erMock } from './utils';

export const hasHashParam = (parameterName: string): boolean => {
	return window.location.hash.includes(parameterName);
};

export const hasQueryParam = (parameterName: string): boolean => {
	return window.location.search.includes(parameterName);
};

const DEV_DOMAINS = ['dev', 'app-q1', 'app-q0', 'localhost'];

const erITestMiljo = (): boolean => {
	return window.location.hostname.split('.').findIndex(domain => DEV_DOMAINS.includes(domain)) >= 0;
};

export const utledSpaUrl = (appName: string): string => {
	return erITestMiljo() ? `https://${appName}.intern.dev.nav.no` : `https://${appName}.intern.nav.no`;
};

export function utledCdnUrl(contextPath: string): string {
	return erITestMiljo() ? `https://cdn.nav.no/dev/${contextPath}` : `https://cdn.nav.no/${contextPath}`;
}

export const loginUrl = () => {
	if (erMock()) {
		return `${window.location.href}`;
	}
	return `${window.location.origin}/oauth2/login?redirect=${window.location.href}`;
};
