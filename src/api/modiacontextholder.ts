export interface HentVeilederOgEnheterResponse {
	navn: string;
	fornavn: string;
	etternavn: string;
	enheter: {
		enhetId: string;
		navn: string;
	}[];
}

export const hentVeilederOgEnheter = async (): Promise<HentVeilederOgEnheterResponse> => {
	const response = await fetch(`/modiacontextholder/api/decorator`, { method: 'GET' });
	if (!response.ok) {
		throw new Error(`Feil ved henting av veileder og enheter: ${response.statusText}`);
	}
	return response.json();
};
