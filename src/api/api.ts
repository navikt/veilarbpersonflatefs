import { DAB_UNLEASH_TOGGLES, DabUnleashFeatures, OBO_UNLEASH_TOGGLES, OboUnleashFeatures } from './features';
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
	return useAxios<AntallUlesteDialoger>(
		{ url: `/veilarbdialog/api/dialog/antallUleste`, method: 'POST', data: fnr ? { fnr } : undefined },
		options
	);
}

export function useFetchSistOppdatert(fnr: string, options?: Options): UseAxiosResponseValue<SistOppdatertData> {
	return useAxios<SistOppdatertData>(
		{ method: 'POST', url: `/veilarbdialog/api/dialog/sistOppdatert`, data: { fnr } },
		options
	);
}

export function useFetchFeaturesFromOboUnleash(): UseAxiosResponseValue<OboUnleashFeatures> {
	const toggles = OBO_UNLEASH_TOGGLES.map(element => 'feature=' + element).join('&');
	return useAxios<OboUnleashFeatures>(`/obo-unleash/api/feature?${toggles}`);
}

export function useFetchFeaturesFromDabUnleash(): UseAxiosResponseValue<DabUnleashFeatures> {
	const toggles = DAB_UNLEASH_TOGGLES.map(element => 'feature=' + element).join('&');
	return useAxios<DabUnleashFeatures>(`/veilarbaktivitet/api/feature?${toggles}`);
}

export function useFetchAktivEnhet(options?: Options): UseAxiosResponseValue<AktivEnhetResponse> {
	return useAxios<AktivEnhetResponse>('/modiacontextholder/api/context/aktivenhet', options);
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
