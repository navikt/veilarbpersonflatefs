import { FrontendEvent } from '../util/frontend-logger';
import { fetchWithHeaders, UseQueryResponseValue } from './utils';
import useSWR from 'swr';

export function useFetchTilgangTilBruker(fnr: string, options?: { manual?: boolean }): UseQueryResponseValue<boolean> {
	const { data, isLoading, error, mutate } = useSWR<boolean>(
		options?.manual ? null : ['tilgangTilBruker', fnr],
		() =>
			fetchWithHeaders<boolean>(`/veilarbperson/api/v3/person/hent-tilgangTilBruker`, {
				method: 'POST',
				body: JSON.stringify({ fnr })
			})
	);
	return { data, loading: isLoading, error: error as Error | null, fetch: mutate };
}

export function sendEventTilVeilarbperson(event: FrontendEvent): Promise<void> {
	return fetchWithHeaders(`/veilarbperson/api/logger/event`, {
		method: 'POST',
		body: JSON.stringify(event)
	});
}
