import { FrontendEvent } from '../util/frontend-logger';
import { fetchWithHeaders } from './utils';
import useSWR from 'swr';

export function useFetchTilgangTilBruker(fnr: string) {
	const { data, isLoading, error, mutate } = useSWR<boolean>(fnr ? ['tilgangTilBruker', fnr] : null, () =>
		fetchWithHeaders<boolean>(`/veilarbperson/api/v3/person/hent-tilgangTilBruker`, {
			method: 'POST',
			body: JSON.stringify({ fnr })
		})
	);
	return { data, loading: isLoading, error, fetch: mutate };
}

export function sendEventTilVeilarbperson(event: FrontendEvent): Promise<void> {
	return fetchWithHeaders(`/veilarbperson/api/logger/event`, {
		method: 'POST',
		body: JSON.stringify(event)
	});
}
