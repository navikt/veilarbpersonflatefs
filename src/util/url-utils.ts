
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
