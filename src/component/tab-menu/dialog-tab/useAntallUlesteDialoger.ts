import { useEffect, useState } from 'react';
import { useEventListener } from '../../../util/utils';
import { listenForNyDialogEvents } from './wsDialogEvents';
import { DIALOG_WEBSOCKET } from '../../../api/features';
import { useFetchAntallUlesteDialoger, useFetchSistOppdatert } from '../../../api/veilarbdialog';
import { useFeaturesFromDabUnleash } from '../../../api/veilarbaktivitet';
import {
	getHarVeilederLeseTilgangTilEksternBruker,
	getHarVeilederTilgangFlytteBrukerTilEgetKontor
} from '../../../api/veilarboppfolging';
import useSWR from 'swr';

export enum UpdateTypes {
	Dialog = 'DIALOG'
}

interface UpdateEventType {
	uppdate: string;
	avsender?: string;
}

function widowEvent(update: UpdateTypes) {
	/*
        Jeg regner med at 'uppdate' er en skrivefeil, men jeg ser at det samme navnet blir brukt i aktivitetsplanen og arbeidsrettet-dialog,
        så jeg gjør ikke noe med det inntil videre.
    */

	const updateEvent = new CustomEvent<UpdateEventType>('uppdate', {
		detail: { uppdate: update, avsender: 'veilarbpersonflatefs' }
	});

	window.dispatchEvent(updateEvent);
}

const DIALOG_LEST_EVENT = 'aktivitetsplan.dialog.lest';

export default function useUlesteDialoger(fnr: string): number | undefined {
	const fetchAntallUlesteDialoger = useFetchAntallUlesteDialoger(fnr);
	const fetchSistOppdatert = useFetchSistOppdatert(fnr);

	const [antallUleste, setAntallUleste] = useState<number | undefined>(undefined);
	const [localSistOppdatert, setLocalSistOppdatert] = useState(new Date());

	useEventListener(DIALOG_LEST_EVENT, () => {
		setAntallUleste(prevState => (prevState ? prevState - 1 : 0));
	});

	const { data: dabToggles } = useFeaturesFromDabUnleash();

	const pollWithHttp = () => {
		let interval: number; // yes this is actually the correct type, interval-handle is just a number
		interval = setInterval(() => fetchSistOppdatert.fetch().catch(() => clearInterval(interval)), 10000);
		return () => clearInterval(interval);
	};

	const { data: veilederTilgang, isLoading: veilederTilgangIsLoading } = useSWR(
		fnr ? ['veilederTIlgang', fnr] : null,
		async () => {
			const response = await getHarVeilederLeseTilgangTilEksternBruker(fnr);
			if (!response.ok) throw response.error;
			return response.data.data.veilederTilgang;
		}
	);
	const veilederHarLeseTilgangTilBruker = veilederTilgang?.harVeilederLeseTilgangTilBruker ?? false;

	useEffect(() => {
		if (veilederTilgangIsLoading) return;
		if (!veilederHarLeseTilgangTilBruker) return;
		if (!dabToggles) return;
		if (dabToggles[DIALOG_WEBSOCKET]) {
			try {
				return listenForNyDialogEvents(() => {
					fetchSistOppdatert.fetch().catch(() => {});
				}, fnr);
			} catch (e) {
				return pollWithHttp();
			}
		} else {
			return pollWithHttp();
		}
	}, [fnr, dabToggles, veilederTilgangIsLoading, veilederHarLeseTilgangTilBruker]);

	useEffect(() => {
		if (fetchAntallUlesteDialoger.data) {
			setAntallUleste(fetchAntallUlesteDialoger.data.antallUleste);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAntallUlesteDialoger.data]);

	useEffect(() => {
		const sistOppdatert = fetchSistOppdatert.data ? fetchSistOppdatert.data.sistOppdatert : undefined;

		if (sistOppdatert) {
			const remoteSistOppdatert = new Date(sistOppdatert);

			if (remoteSistOppdatert > localSistOppdatert) {
				widowEvent(UpdateTypes.Dialog);
				fetchAntallUlesteDialoger.fetch();
				setLocalSistOppdatert(new Date());
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchSistOppdatert.data]);

	return antallUleste;
}
