import { useQuery } from '@tanstack/react-query';
import { DAB_UNLEASH_TOGGLES, DabUnleashFeatures } from './features';
import { fetchWithHeaders, UseQueryResponseValue } from './utils';
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
	fraKontor?: Kontor;
	tilKontor: Kontor;
}

export const settKontor = async (fnr: string, kontorId: string): Promise<SettKontorResponse> => {
	const response = await fetch(`/ao-oppfolgingskontor/api/kontor`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({kontorId, ident: fnr})})
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
	options?: { manual?: boolean }
): UseQueryResponseValue<AntallUlesteDialoger> {
	const { data, isLoading, error, refetch } = useQuery<AntallUlesteDialoger>({
		queryKey: ['antallUlesteDialoger', fnr],
		queryFn: () => fetchWithHeaders<AntallUlesteDialoger>(`/veilarbdialog/api/dialog/antallUleste`, {
			method: 'POST',
			body: JSON.stringify(fnr ? { fnr } : undefined),
		}),
		enabled: !options?.manual,
	});
	return { data, loading: isLoading, error: error as Error | null, fetch: refetch };
}

export function useFetchSistOppdatert(fnr: string, options?: { manual?: boolean }): UseQueryResponseValue<SistOppdatertData> {
	const { data, isLoading, error, refetch } = useQuery<SistOppdatertData>({
		queryKey: ['sistOppdatert', fnr],
		queryFn: () => fetchWithHeaders<SistOppdatertData>(`/veilarbdialog/api/dialog/sistOppdatert`, {
			method: 'POST',
			body: JSON.stringify({ fnr }),
		}),
		enabled: !options?.manual,
	});
	return { data, loading: isLoading, error: error as Error | null, fetch: refetch };
}

export function useFetchFeaturesFromDabUnleash(): UseQueryResponseValue<DabUnleashFeatures> {
	const toggles = DAB_UNLEASH_TOGGLES.map(element => 'feature=' + element).join('&');
	const { data, isLoading, error, refetch } = useQuery<DabUnleashFeatures>({
		queryKey: ['dabFeatures'],
		queryFn: () => fetchWithHeaders<DabUnleashFeatures>(`/veilarbaktivitet/api/feature?${toggles}`),
	});
	return { data, loading: isLoading, error: error as Error | null, fetch: refetch };
}

export function useFetchTilgangTilBruker(fnr: string, options?: { manual?: boolean }): UseQueryResponseValue<boolean> {
	const { data, isLoading, error, refetch } = useQuery<boolean>({
		queryKey: ['tilgangTilBruker', fnr],
		queryFn: () => fetchWithHeaders<boolean>(`/veilarbperson/api/v3/person/hent-tilgangTilBruker`, {
			method: 'POST',
			body: JSON.stringify({ fnr }),
		}),
		enabled: !options?.manual,
	});
	return { data, loading: isLoading, error: error as Error | null, fetch: refetch };
}

export function sendEventTilVeilarbperson(event: FrontendEvent): Promise<void> {
	return fetchWithHeaders(`/veilarbperson/api/logger/event`, {
		method: 'POST',
		body: JSON.stringify(event),
	});
}

export function hentSesjonMetadata(): Promise<SessionMeta> {
	return fetchWithHeaders<SessionMeta>('/oauth2/session');
}
