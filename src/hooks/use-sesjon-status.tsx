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
	const [teller, setTeller] = useState<number>(0);

	const oppdaterSesjonStatus = (sesjonMetadata: SessionMeta) => {
		const _sekunderTilSesjonUtloper = sesjonMetadata?.tokens?.expire_in_seconds;

		if (!isDefined(_sekunderTilSesjonUtloper)) {
			console.error('Forsøkte å hente sesjonsmetadata men expire_in_seconds var null eller undefined.');
			return;
		}

		setTeller((prevState: number) => prevState + 1);
		setSesjonStatus(SesjonStatus.AKTIV);
		setSekunderTilSesjonUtloper(_sekunderTilSesjonUtloper);
	};

	useEffect(() => {
		hentSesjonMetadata()
			.then(oppdaterSesjonStatus)
			.catch(() => setSesjonStatus(SesjonStatus.UTLOPT));
	}, []);

	useEffect(() => {
		let timeout: number | undefined;

		if (sekunderTilSesjonUtloper !== null) {
			const msTilSesjonUtloper = sekunderTilSesjonUtloper * 1000;

			timeout = window.setTimeout(() => {
				hentSesjonMetadata()
					.then(oppdaterSesjonStatus)
					.catch(() => setSesjonStatus(SesjonStatus.UTLOPT));
			}, msTilSesjonUtloper + 100);
		}

		return () => window.clearTimeout(timeout);
	}, [teller, sekunderTilSesjonUtloper]);

	return { sesjonStatus };
};
