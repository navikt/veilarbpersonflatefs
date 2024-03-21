import { useLoadDeltakerRegistreringApp } from './hooks/useLoadDeltakerRegistreringApp';
import { useModiaContext } from '../../store/modia-context-store';
import { createElement } from 'react';

const DeltakelsePage = () => {

	useLoadDeltakerRegistreringApp();

	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	return (
		createElement('arbeidsmarkedstiltak-deltaker', {
			'data-personident': aktivBrukerFnr,
			'data-enhetId': aktivEnhetId
		})
	);
};

export default DeltakelsePage;
