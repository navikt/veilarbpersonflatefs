import { useLoadDeltakerRegistreringApp } from './hooks/useLoadDeltakerRegistreringApp';
import { useModiaContext } from '../../store/modia-context-store';
import { createElement } from 'react';

const TiltakPage = () => {

	useLoadDeltakerRegistreringApp();

	const searchParams = new URLSearchParams(window.location.search);
	const tiltaksgjennomforingId = searchParams.get('id');

	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	return (
		createElement('arbeidsmarkedstiltak-deltaker', {
			'data-personident': aktivBrukerFnr,
			'data-deltakerlisteId': tiltaksgjennomforingId,
			'data-enhetId': aktivEnhetId
		})
	);
};

export default TiltakPage;
