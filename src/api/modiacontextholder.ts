import axios, { AxiosResponse } from 'axios';

export interface HentVeilederOgEnheterResponse {
    navn: string;
    fornavn: string;
    etternavn: string;
    enheter: {
        enhetId: string;
        navn: string;
    }[]
}

export function hentVeilederOgEnheter():  Promise<AxiosResponse<HentVeilederOgEnheterResponse>> {
    return axios.get(`/modiacontextholder/api/decorator`)
}
