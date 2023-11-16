import { ALL_TOGGLES, ARBEIDSMARKEDSTILTAK_LANSERING, Features } from './features';
import { axiosInstance, useAxios, UseAxiosResponseValue } from './utils';
import { Options } from 'axios-hooks';
import { AxiosPromise, AxiosResponse } from 'axios';
import { FrontendEvent } from '../util/frontend-logger';

export interface AntallUlesteDialoger {
	antallUleste: number;
}

export interface AktivEnhetResponse {
	aktivEnhet: string | null;
}

export interface AktivBrukerResponse {
	aktivBruker: string | null;
}

export interface SistOppdatertData {
	sistOppdatert?: string;
}

export interface AuthInfo {
	loggedIn: boolean;
	remainingSeconds: number;
	expirationTime: string;
	securityLevel?: string;
}

export interface Session {
	created_at?: string;
	ends_at?: string;
	ends_in_seconds?: number;
}

export interface Tokens {
	expire_at?: string;
	expire_in_seconds?: number;
	next_auto_refresh_in_seconds?: number;
	refresh_cooldown?: boolean;
	refresh_cooldown_seconds?: number;
	refreshed_at?: string;
}

export interface SessionMeta {
	session?: Session;
	tokens?: Tokens;
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

export function useFetchFeaturesForTeamValp(options?: Options): UseAxiosResponseValue<Boolean> {
	return useAxios<Features>(
		`/mulighetsrommet-api/api/v1/internal/features?feature=${ARBEIDSMARKEDSTILTAK_LANSERING}`,
		options
	);
}

export function useFetchAktivEnhet(options?: Options): UseAxiosResponseValue<AktivEnhetResponse> {
	return useAxios<AktivEnhetResponse>('/modiacontextholder/api/context/aktivenhet', options);
}

export function useFetchAktivBruker(): UseAxiosResponseValue<AktivBrukerResponse> {
	return useAxios<AktivBrukerResponse>('/modiacontextholder/api/context/aktivbruker');
}

export function useFetchTilgangTilBruker(fnr: string, options?: Options): UseAxiosResponseValue<boolean> {
	return useAxios<boolean>(
		{
			url: `/veilarbperson/api/v3/person/hent-tilgangTilBruker`,
			method: 'POST',
			data: { fnr }
		},
		options
	);
}

export function synkroniserManuellStatusMedDkif(fnr: string): AxiosPromise<null> {
	return axiosInstance.post(`/veilarboppfolging/api/v3/manuell/synkroniser-med-dkif`, { fnr });
}

export function sendEventTilVeilarbperson(event: FrontendEvent) {
	return axiosInstance.post(`/veilarbperson/api/logger/event`, event);
}

export function hentSesjonMetadata(): Promise<SessionMeta> {
	return axiosInstance.get('/oauth2/session').then((res: AxiosResponse<SessionMeta>) => Promise.resolve(res.data));
}
