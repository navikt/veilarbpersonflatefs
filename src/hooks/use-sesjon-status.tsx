import { useQuery } from '@tanstack/react-query';
import { hentSesjonMetadata, SessionMeta } from '../api/api';
import { isDefined } from '../util/typeguards';

export enum SesjonStatus {
	AKTIV,
	UTLOPT,
	UINITIALISERT
}

const getRefetchInterval = (data: SessionMeta | undefined): number | false => {
	if (!data) return false;
	const tokenSek = data.tokens?.expire_in_seconds;
	const sesjonSek = data.session?.ends_in_seconds;
	if (!isDefined(tokenSek) || !isDefined(sesjonSek)) {
		console.error(
			'Forsøkte å hente sesjonsmetadata men expire_in_seconds/ends_in_seconds var null eller undefined.'
		);
		return false;
	}
	return Math.min(tokenSek, sesjonSek) * 1000 + 100;
};

export const useSesjonStatus = (): { sesjonStatus: SesjonStatus } => {
	const { _, isError, isPending } = useQuery({
		queryKey: ['sesjonMetadata'],
		queryFn: hentSesjonMetadata,
		refetchInterval: query => getRefetchInterval(query.state.data),
		retry: false
	});

	if (isError) return { sesjonStatus: SesjonStatus.UTLOPT };
	if (isPending) return { sesjonStatus: SesjonStatus.UINITIALISERT };
	return { sesjonStatus: SesjonStatus.AKTIV };
};
