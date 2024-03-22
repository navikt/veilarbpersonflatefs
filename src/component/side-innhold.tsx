import { Router } from '../Router';
import { useModiaContext } from '../store/modia-context-store';
import { Visittkort } from './spa';
import TabMenu from './tab-menu/TabMenu';

const SideInnhold = () => {
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
