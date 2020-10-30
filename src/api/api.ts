import { fetchToJson } from './rest-utils';
import { ALL_TOGGLES, Features } from './features';
import { useFetch } from './utils';

export const FEATURE_TOGGLE_URL = '/veilarbpersonflatefs/api/feature';
export const ULESTE_DIALOGER_URL = '/veilarbdialog/api/dialog/antallUleste';
export const SIST_OPPDATERT_DIALOGER_URL = '/veilarbdialog/api/dialog/sistOppdatert';
export const AKTIV_ENHET_URL = '/modiacontextholder/api/context/aktivenhet';

const credentials = 'same-origin';

export const HEADERS_WITH_JSON_CONTENT = {
	'Content-Type': 'application/json'
};

export interface UlesteDialoger {
	antallUleste: number;
}

export interface AktivEnhetResponse {
	aktivEnhet: string | null;
}

export interface SistOppdatertData {
	sistOppdatert?: string;
}

export function fetchUlesteDialoger(fnr: string): Promise<UlesteDialoger> {
	return fetchToJson<UlesteDialoger>(`${ULESTE_DIALOGER_URL}/?fnr=${fnr}`);
}

export function fetchSistOppdatert(fnr: string): Promise<SistOppdatertData> {
	return fetchToJson<SistOppdatertData>(`${SIST_OPPDATERT_DIALOGER_URL}/?fnr=${fnr}`);
}

export const useFetchFeatures = () => {
	const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
	return useFetch<Features>(`${FEATURE_TOGGLE_URL}/?${toggles}`, {credentials})
};

export const useFetchTilgangTilBruker = (fnr: string) => {
	return useFetch<true>(`/veilarbperson/api/person/${fnr}/tilgangTilBruker`, {credentials})
};

export const useFetchAktivEnhet = () => {
	return useFetch<AktivEnhetResponse>('/modiacontextholder/api/context/aktivenhet', {credentials})
};