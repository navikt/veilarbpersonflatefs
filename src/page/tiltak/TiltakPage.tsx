import { useLoadDeltakerRegistreringApp } from './hooks/useLoadDeltakerRegistreringApp';
import { useModiaContext } from '../../store/modia-context-store';
import { createElement } from 'react';
import { Alert } from '@navikt/ds-react';

const TiltakPage = () => {

	useLoadDeltakerRegistreringApp();

	const searchParams = new URLSearchParams(window.location.search);
	const tiltaksgjennomforingId = searchParams.get('id');

	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	if (tiltaksgjennomforingId === null) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
				<Alert variant="error">Klarte ikke laste deltakerregistrering</Alert>
			</div>
		);
	}

	return (
		createElement('arbeidsmarkedstiltak-deltaker', {
			'data-personident': aktivBrukerFnr,
			'data-deltakerlisteId': tiltaksgjennomforingId,
			'data-enhetId': aktivEnhetId
		})
	);
};

export default TiltakPage;
