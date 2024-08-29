import { Router } from '../Router';
import { useModiaContext } from '../store/modia-context-store';
import { Visittkort } from './spa';
import TabMenu from './tab-menu/TabMenu';
import { utledTilbakeUrl } from '../util/url-utils';

const SideInnhold = () => {
	const { aktivBrukerFnr, aktivEnhetId, renderKey } = useModiaContext();

	return (
		<>
			<Visittkort
				key={renderKey}
				enhet={aktivEnhetId ?? undefined}
				fnr={aktivBrukerFnr}
				visVeilederVerktoy={true}
				tilbakeTilFlate={utledTilbakeUrl()}
			/>
			<TabMenu />
			<Router />
		</>
	);
};

export default SideInnhold;
