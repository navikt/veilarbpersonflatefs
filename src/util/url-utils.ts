
export const hasHashParam = (parameterName: string): boolean => {
	return window.location.hash.includes(parameterName);
};

export const hasQueryParam = (parameterName: string): boolean => {
	return window.location.search.includes(parameterName);
};

const BASE_URL = '/veilarbpersonflatefs/';

const regex = `^${BASE_URL}(\\d+)`;

export const hentFnrFraUrl = (): string | undefined => {
	const url = window.location.pathname;
	const match = url.match(regex);

	if (match && match.length === 2) {
		return match[1];
	}

	return undefined;
};

const DEV_DOMAINS = ['dev', 'app-q1', 'app-q0', 'localhost'];

const erITestMiljo = (): boolean => {
	return window.location.hostname
		.split('.')
		.findIndex(domain => DEV_DOMAINS.includes(domain)) >= 0;
};

export const utledSpaUrl = (appName: string): string => {
	return erITestMiljo()
		? `https://${appName}.dev.intern.nav.no`
		: `https://${appName}.intern.nav.no`;
};
