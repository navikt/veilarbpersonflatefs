import { useAxios, UseAxiosResponseValue } from './utils';

export interface HentVeilederOgEnheterResponse {
    navn: string;
    fornavn: string;
    etternavn: string;
    enheter: {
        enhetId: string;
        navn: string;
    }[]
}

export function useVeilederOgEnheter(): UseAxiosResponseValue<HentVeilederOgEnheterResponse> {
	return useAxios<HentVeilederOgEnheterResponse>(`/modiacontextholder/api/decorator`);
}