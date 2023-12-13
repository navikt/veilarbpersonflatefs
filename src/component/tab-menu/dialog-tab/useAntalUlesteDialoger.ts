import { useEffect, useState } from 'react';
import { useFetchAntallUlesteDialoger, useFetchFeaturesFromDabUnleash, useFetchSistOppdatert } from '../../../api/api';
import { useEventListener } from '../../../util/utils';
import { listenForNyDialogEvents } from './wsDialogEvents';
import { DIALOG_WEBSOCKET } from '../../../api/features';

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
	const fetchAntallUlesteDialoger = useFetchAntallUlesteDialoger(fnr, { manual: true });
	const fetchSistOppdatert = useFetchSistOppdatert(fnr, { manual: true });

	const [antallUleste, setAntallUleste] = useState<number | undefined>(undefined);
	const [localSistOppdatert, setLocalSistOppdatert] = useState(new Date());

	useEventListener(DIALOG_LEST_EVENT, () => {
		setAntallUleste(prevState => (prevState ? prevState - 1 : 0));
	});

	const { fetch: fetchDabFeatureToggles, data: dabToggles } = useFetchFeaturesFromDabUnleash();
	useEffect(() => {
		fetchDabFeatureToggles();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!dabToggles) return;
		if (dabToggles[DIALOG_WEBSOCKET]) {
			return listenForNyDialogEvents(() => {
				fetchSistOppdatert.fetch().catch(() => {});
			});
		} else {
			let interval: NodeJS.Timeout;
			interval = setInterval(() => fetchSistOppdatert.fetch().catch(() => clearInterval(interval)), 10000);
			return () => clearInterval(interval);
		}
	}, [dabToggles]);

	useEffect(() => {
		fetchAntallUlesteDialoger.fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fnr]);

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
