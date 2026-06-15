import { BRUK_AO_KONTOR_SOM_MASTER, DAB_UNLEASH_TOGGLES, DabUnleashFeatures } from './features';
import { fetchWithHeaders, UseQueryResponseValue } from './utils';
import useSWR from 'swr';

export function useFeaturesFromDabUnleash(): UseQueryResponseValue<DabUnleashFeatures> {
	const toggles = DAB_UNLEASH_TOGGLES.map(element => 'feature=' + element).join('&');
	const { data, isLoading, error, mutate } = useSWR<DabUnleashFeatures>('dabFeatures', () =>
		fetchWithHeaders<DabUnleashFeatures>(`/veilarbaktivitet/api/feature?${toggles}`)
	);
	return { data, loading: isLoading, error: error as Error | null, fetch: mutate };
}

export const useBrukAoKontorSomMaster = () => {
	const { data } = useFeaturesFromDabUnleash();
	return data ? data[BRUK_AO_KONTOR_SOM_MASTER] || false : false;
};
