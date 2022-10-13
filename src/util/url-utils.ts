import { erMock } from './utils';

export const hasHashParam = (parameterName: string): boolean => {
	return window.location.hash.includes(parameterName);
};

export const hasQueryParam = (parameterName: string): boolean => {
	return window.location.search.includes(parameterName);
};

const regex = `\\d{11}`;

export const hentFnrFraUrl = (): string | undefined => {
	const url = window.location.pathname;
	const match = url.match(regex);

	if (match && match.length === 1) {
		return match[0];
	}

	return undefined;
};

const DEV_DOMAINS = ['dev', 'app-q1', 'app-q0', 'localhost'];

const erITestMiljo = (): boolean => {
	return window.location.hostname.split('.').findIndex(domain => DEV_DOMAINS.includes(domain)) >= 0;
};

export const utledSpaUrl = (appName: string): string => {
	return erITestMiljo() ? `https://${appName}.dev.intern.nav.no` : `https://${appName}.intern.nav.no`;
};

export const loginUrl = () => {
	if (erMock()) {
		return `${window.location.href}`;
	}
	return `${window.location.origin}/oauth2/login?redirect=${window.location.href}`;
};
