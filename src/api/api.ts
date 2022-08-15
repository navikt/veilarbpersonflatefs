import { ALL_TOGGLES, Features } from './features';
import { axiosInstance, useAxios, UseAxiosResponseValue } from './utils';
import { Options } from 'axios-hooks';
import { AxiosPromise } from 'axios';
import { FrontendEvent } from '../util/frontend-logger';

export interface AntallUlesteDialoger {
	antallUleste: number;
}

export interface AktivEnhetResponse {
	aktivEnhet: string | null;
}

export interface SistOppdatertData {
	sistOppdatert?: string;
}

export function useFetchAntallUlesteDialoger(
	fnr: string,
	options?: Options
): UseAxiosResponseValue<AntallUlesteDialoger> {
	return useAxios<AntallUlesteDialoger>(`/veilarbdialog/api/dialog/antallUleste?fnr=${fnr}`, options);
}

export function useFetchSistOppdatert(fnr: string, options?: Options): UseAxiosResponseValue<SistOppdatertData> {
	return useAxios<SistOppdatertData>(`/veilarbdialog/api/dialog/sistOppdatert?fnr=${fnr}`, options);
}

export function useFetchFeatures(options?: Options): UseAxiosResponseValue<Features> {
	const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
	return useAxios<Features>(`/veilarbpersonflatefs/api/feature?${toggles}`, options);
}

export function useFetchAktivEnhet(options?: Options): UseAxiosResponseValue<AktivEnhetResponse> {
	return useAxios<AktivEnhetResponse>('/modiacontextholder/api/context/aktivenhet', options);
}

export function useFetchTilgangTilBruker(fnr: string, options?: Options): UseAxiosResponseValue<true> {
	return useAxios<true>({ url: `/veilarbperson/api/person/${fnr}/tilgangTilBruker` }, options);
}

export function synkroniserManuellStatusMedDkif(fnr: string): AxiosPromise<null> {
	return axiosInstance.post(`/veilarboppfolging/api/v2/manuell/synkroniser-med-dkif?fnr=${fnr}`);
}

export function sendEventTilVeilarbperson(event: FrontendEvent) {
	return axiosInstance.post(`/veilarbperson/api/logger/event`, event);
}
