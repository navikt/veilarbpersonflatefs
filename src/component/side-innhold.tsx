import { OboUnleashFeatures } from '../api/features';
import { useModiaContext } from '../store/modia-context-store';
import { Visittkort } from './spa';
import NewTabMenu from './new-tab-menu/NewTabMenu';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../Routes';

interface SideInnholdLayoutProps {
	oboUnleashFeatures?: OboUnleashFeatures;
}

export enum TabId {
	AKTIVITETSPLAN = 'AKTIVITETSPLAN',
	DIALOG = 'DIALOG',
	VEDTAKSSTOTTE = 'VEDTAKSSTOTTE',
	DETALJER = 'DETALJER',
	OVERBLIKK = 'OVERBLIKK',
	ARBEIDSMARKEDSTILTAK = 'ARBEIDSMARKEDSTILTAK',
	FINN_STILLING_INNGANG = 'FINN_STILLING_INNGANG'
}

const SideInnhold = (props: SideInnholdLayoutProps) => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	return (
		<>
			<Visittkort
				enhet={aktivEnhetId ?? undefined}
				fnr={aktivBrukerFnr}
				visVeilederVerktoy={true}
				tilbakeTilFlate="veilarbportefoljeflatefs"
			/>
			<BrowserRouter>
				<NewTabMenu />
				<AppRoutes />
			</BrowserRouter>
		</>
	);

};

export default SideInnhold;
