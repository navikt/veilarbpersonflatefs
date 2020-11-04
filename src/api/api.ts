import { ALL_TOGGLES, Features } from './features';
import { AxiosResponse } from 'axios';
import { axiosInstance, useAxios } from './utils';

export const FEATURE_TOGGLE_URL = '/veilarbpersonflatefs/api/feature';
export const ULESTE_DIALOGER_URL = '/veilarbdialog/api/dialog/antallUleste';
export const SIST_OPPDATERT_DIALOGER_URL = '/veilarbdialog/api/dialog/sistOppdatert';
export const AKTIV_ENHET_URL = '/modiacontextholder/api/context/aktivenhet';

export interface UlesteDialoger {
	antallUleste: number;
}

export interface AktivEnhetResponse {
	aktivEnhet: string | null;
}

export interface SistOppdatertData {
	sistOppdatert?: string;
}

export function fetchUlesteDialoger(fnr: string): Promise<AxiosResponse<UlesteDialoger>> {
	return axiosInstance.get<UlesteDialoger>(`${ULESTE_DIALOGER_URL}/?fnr=${fnr}`);
}

export function fetchSistOppdatert(fnr: string): Promise<AxiosResponse<SistOppdatertData>> {
	return axiosInstance.get<SistOppdatertData>(`${SIST_OPPDATERT_DIALOGER_URL}/?fnr=${fnr}`);
}

export function useFetchFeatures() {
	const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
	return useAxios<Features>(`${FEATURE_TOGGLE_URL}/?${toggles}`);
}

// export function useFetchTilgangTilBruker(config: AxiosRequestConfig | string, options?: Options) {
// 	return useAxios<true>(`/veilarbperson/api/person/${fnr}/tilgangTilBruker`, { manual: true });
// }

export function useFetchAktivEnhet() {
	return useAxios<AktivEnhetResponse>(AKTIV_ENHET_URL);
}

export function lagFetchTilgangTilBrukerUrl(fnr: string): string {
	return `/veilarbperson/api/person/${fnr}/tilgangTilBruker`;
}
