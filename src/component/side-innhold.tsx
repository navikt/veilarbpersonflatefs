import { Router } from '../Router';
import { useModiaContext } from '../store/modia-context-store';
import TabMenu from './tab-menu/TabMenu';
import { utledTilbakeUrl } from '../util/url-utils';
import { Visittkort } from './visittkort';
import { useState } from 'react';

type Theme = 'light' | 'dark';

const SideInnhold = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	const [theme, setTheme] = useState<Theme>('light');

	return (
		<>
			<Visittkort
				enhet={aktivEnhetId ?? undefined}
				fnr={aktivBrukerFnr}
				visVeilederVerktoy={true}
				tilbakeTilFlate={utledTilbakeUrl()}
				onThemeChange={setTheme}
			/>
			<TabMenu />
			<Router theme={theme} />
		</>
	);
};

export default SideInnhold;
