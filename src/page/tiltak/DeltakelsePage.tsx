import { useLoadDeltakerRegistreringApp } from './hooks/useLoadDeltakerRegistreringApp';
import { useModiaContext } from '../../store/modia-context-store';
import { createElement } from 'react';

type Theme = 'light' | 'dark';

interface DeltakelsePageProps {
	theme: Theme;
}

const DeltakelsePage = ({ theme }: DeltakelsePageProps) => {

	useLoadDeltakerRegistreringApp();

	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	return (
		createElement('arbeidsmarkedstiltak-deltaker', {
			'data-personident': aktivBrukerFnr,
			'data-enhetId': aktivEnhetId,
			'data-theme': theme,
			theme
		})
	);
};

export default DeltakelsePage;
