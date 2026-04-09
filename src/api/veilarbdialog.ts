import { fetchWithHeaders, UseQueryResponseValue } from './utils';
import { AntallUlesteDialoger } from './api';
import useSWR from 'swr';

export interface SistOppdatertData {
	sistOppdatert?: string;
}

export function useFetchAntallUlesteDialoger(fnr: string | undefined): UseQueryResponseValue<AntallUlesteDialoger> {
	const { data, isLoading, error, mutate } = useSWR<AntallUlesteDialoger>(
		fnr ? ['antallUlesteDialoger', fnr] : null,
		() =>
			fetchWithHeaders<AntallUlesteDialoger>(`/veilarbdialog/api/dialog/antallUleste`, {
				method: 'POST',
				body: JSON.stringify(fnr ? { fnr } : undefined)
			})
	);
	return { data, loading: isLoading, error: error as Error | null, fetch: mutate };
}

export function useFetchSistOppdatert(fnr: string): UseQueryResponseValue<SistOppdatertData> {
	const { data, isLoading, error, mutate } = useSWR<SistOppdatertData>(fnr ? ['sistOppdatert', fnr] : null, () =>
		fetchWithHeaders<SistOppdatertData>(`/veilarbdialog/api/dialog/sistOppdatert`, {
			method: 'POST',
			body: JSON.stringify({ fnr })
		})
	);
	return { data, loading: isLoading, error: error as Error | null, fetch: mutate };
}
