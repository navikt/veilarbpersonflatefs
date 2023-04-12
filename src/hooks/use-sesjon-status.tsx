import { useEffect, useState } from 'react';
import { hentSesjonMetadata, SessionMeta } from '../api/api';
import { isDefined } from '../util/typeguards';

export enum SesjonStatus {
	AKTIV,
	UTLOPT,
	UINITIALISERT
}

export const useSesjonStatus = (): { sesjonStatus: SesjonStatus } => {
	const [sekunderTilSesjonUtloper, setSekunderTilSesjonUtloper] = useState<number | null>(null);
	const [sesjonStatus, setSesjonStatus] = useState<SesjonStatus>(SesjonStatus.UINITIALISERT);

	const oppdaterSesjonStatus = (sesjonMetadata: SessionMeta) => {
		const tokensUtloperOmSekunder = sesjonMetadata?.tokens?.expire_in_seconds;
		const sesjonUtloperOmSekunder = sesjonMetadata?.session?.ends_in_seconds;

		if (!isDefined(tokensUtloperOmSekunder) || !isDefined(sesjonUtloperOmSekunder)) {
			console.error(
				'Forsøkte å hente sesjonsmetadata men expire_in_seconds/ends_in_seconds var null eller undefined.'
			);
			return;
		}

		setSesjonStatus(SesjonStatus.AKTIV);
		setSekunderTilSesjonUtloper(Math.min(tokensUtloperOmSekunder, sesjonUtloperOmSekunder));
	};

	useEffect(() => {
		hentSesjonMetadata()
			.then(oppdaterSesjonStatus)
			.catch(() => setSesjonStatus(SesjonStatus.UTLOPT));
	}, []);

	useEffect(() => {
		let timeout: number | undefined;

		if (isDefined(sekunderTilSesjonUtloper) && !isNaN(sekunderTilSesjonUtloper)) {
			const msTilSesjonUtloper = sekunderTilSesjonUtloper * 1000;

			if (timeout) {
				window.clearTimeout(timeout);
			}
			timeout = window.setTimeout(() => {
				hentSesjonMetadata()
					.then(oppdaterSesjonStatus)
					.catch(() => setSesjonStatus(SesjonStatus.UTLOPT));
			}, msTilSesjonUtloper + 100);
		}

		return () => window.clearTimeout(timeout);
	}, [sekunderTilSesjonUtloper]);

	return { sesjonStatus };
};
