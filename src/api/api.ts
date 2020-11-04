import { ALL_TOGGLES, Features } from './features';
import { useAxios, UseAxiosResponseValue } from './utils';
import { Options } from 'axios-hooks';

export interface AntallUlesteDialoger {
	antallUleste: number;
}

export interface AktivEnhetResponse {
	aktivEnhet: string | null;
}

export interface SistOppdatertData {
	sistOppdatert?: string;
}

export function useFetchAntallUlesteDialoger(fnr: string, options?: Options): UseAxiosResponseValue<AntallUlesteDialoger> {
	return useAxios<AntallUlesteDialoger>(`/veilarbdialog/api/dialog/antallUleste?fnr=${fnr}`, options);
}

export function useFetchSistOppdatert(fnr: string, options?: Options): UseAxiosResponseValue<SistOppdatertData> {
	return useAxios<SistOppdatertData>(`/veilarbdialog/api/dialog/sistOppdatert?fnr=${fnr}`, options);
}

export function useFetchFeatures(options?: Options): UseAxiosResponseValue<Features> {
	const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
	return useAxios<Features>(`/veilarbpersonflatefs/api/feature?${toggles}`, options);
}

export function useFetchAktivEnhet(options?: Options): UseAxiosResponseValue<AktivEnhetResponse>  {
	return useAxios<AktivEnhetResponse>('/modiacontextholder/api/context/aktivenhet', options);
}

export function useFetchTilgangTilBruker(fnr: string, options?: Options): UseAxiosResponseValue<true> {
	return useAxios<true>({ url: `/veilarbperson/api/person/${fnr}/tilgangTilBruker` }, options);
}
