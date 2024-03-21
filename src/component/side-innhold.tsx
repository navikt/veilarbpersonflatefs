import { OboUnleashFeatures } from '../api/features';
import { useModiaContext } from '../store/modia-context-store';
import { Visittkort } from './spa';
import { Router } from '../Router';
import TabMenu from './tab-menu/TabMenu';

interface SideInnholdLayoutProps {
	oboUnleashFeatures?: OboUnleashFeatures;
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
			<TabMenu />
			<Router />
		</>
	);

};

export default SideInnhold;
