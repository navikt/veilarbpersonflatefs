import useSWR from 'swr';
import { hentSesjonMetadata, SessionMeta } from '../api/api';
import { isDefined } from '../util/typeguards';

export enum SesjonStatus {
	AKTIV,
	UTLOPT,
	UINITIALISERT
}

const getRefetchInterval = (data: SessionMeta | undefined): number => {
	if (!data) return 0;
	const tokenSek = data.tokens?.expire_in_seconds;
	const sesjonSek = data.session?.ends_in_seconds;
	if (!isDefined(tokenSek) || !isDefined(sesjonSek)) {
		console.error(
			'Forsøkte å hente sesjonsmetadata men expire_in_seconds/ends_in_seconds var null eller undefined.'
		);
		return 0;
	}
	return Math.min(tokenSek, sesjonSek) * 1000 + 100;
};

export const useSesjonStatus = (): { sesjonStatus: SesjonStatus } => {
	const { error, isLoading } = useSWR('sesjonMetadata', hentSesjonMetadata, {
		refreshInterval: getRefetchInterval,
		shouldRetryOnError: false
	});

	if (error) return { sesjonStatus: SesjonStatus.UTLOPT };
	if (isLoading) return { sesjonStatus: SesjonStatus.UINITIALISERT };
	return { sesjonStatus: SesjonStatus.AKTIV };
};
