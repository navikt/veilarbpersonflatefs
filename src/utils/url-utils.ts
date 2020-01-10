import * as queryString from 'query-string';

const location = window.location;

export const refreshMedNyEnhetIUrl = (enhet: string) => {
	const currentParams = queryString.parse(location.search);
	currentParams.enhet = enhet;
	location.search = queryString.stringify(currentParams);
};

export function hentEnhetIdFraUrl(): string | undefined {
	const enhet = queryString.parse(location.search).enhet;

	if (Array.isArray(enhet)) {
		return enhet[0];
	}

	return enhet || undefined;
}

export function enhetFinnesIUrl() {
	return !!hentEnhetIdFraUrl();
}

export function miljoFraUrl() {
	return utledMiljoFraHost(location.host);
}

export function utledMiljoFraHost(host: string) {
	const matches = host.match(/-[a-zA-Z][0-9]+/);
	return matches == null ? '' : matches[0];
}

const BASE_URL = '/veilarbpersonflatefs/';

export const refreshMedNyFnrIUrl = (fodselsnummer: string): void => {
	window.location.pathname = `${BASE_URL}${fodselsnummer}`;
};

const regex = `^${BASE_URL}(\\d+)`;

export const hentFnrFraUrl = (): string | undefined => {
	const url = window.location.pathname;
	const match = url.match(regex);
	if (match && match.length === 2) {
		return match[1];
	}
	return undefined;
};
