import { DAB_UNLEASH_TOGGLES, DabUnleashFeatures } from './features';
import { axiosInstance, useAxios, UseAxiosResponseValue } from './utils';
import { Options } from 'axios-hooks';
import { AxiosResponse } from 'axios';
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

export interface HentVeilederOgEnheterResponse {
	navn: string;
	fornavn: string;
	etternavn: string;
	enheter: {
		enhetId: string;
		navn: string;
	}[]
}

interface Kontor {
	kontorNavn: string;
	kontorId: string;
}

interface SettKontorResponse {
	fraKontor: Kontor;
	tilKontor: Kontor;
}

export const settKontor = async (fnr: string, kontorId: string): Promise<SettKontorResponse> => {
	const response = await fetch(`/ao-oppfolgingskontor/api/kontor`, {method: 'POST', body: JSON.stringify({kontorId, ident: fnr})})
	if(!response.ok) {
		throw new Error(`Feil ved oppdatering av kontor: ${response.statusText}`)
	}
	return response.json()
}

export const hentVeilederOgEnheter = async (): Promise<HentVeilederOgEnheterResponse> => {
	const response = await fetch(`/modiacontextholder/api/decorator`, {method: 'GET'})
	if(!response.ok) {
		throw new Error(`Feil ved henting av veileder og enheter: ${response.statusText}`)
	}
	return response.json()
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

export function useFetchFeaturesFromDabUnleash(): UseAxiosResponseValue<DabUnleashFeatures> {
	const toggles = DAB_UNLEASH_TOGGLES.map(element => 'feature=' + element).join('&');
	return useAxios<DabUnleashFeatures>(`/veilarbaktivitet/api/feature?${toggles}`);
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

export function sendEventTilVeilarbperson(event: FrontendEvent) {
	return axiosInstance.post(`/veilarbperson/api/logger/event`, event);
}

export function hentSesjonMetadata(): Promise<SessionMeta> {
	return axiosInstance.get('/oauth2/session').then((res: AxiosResponse<SessionMeta>) => Promise.resolve(res.data));
}
