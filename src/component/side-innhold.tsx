import { useState } from 'react';
import { Router } from '../Router';
import { useModiaContext } from '../store/modia-context-store';
import TabMenu from './tab-menu/TabMenu';
import { utledTilbakeUrl } from '../util/url-utils';
import { Visittkort } from './visittkort';

type Theme = 'light' | 'dark';

const SideInnhold = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	const [theme, setTheme] = useState<Theme>('light');

	return (
		<div className={`aksel-theme ${theme}`}>
			<Visittkort
				enhet={aktivEnhetId ?? undefined}
				fnr={aktivBrukerFnr}
				visVeilederVerktoy="true"
				tilbakeTilFlate={utledTilbakeUrl()}
				theme={theme}
				onThemeChange={setTheme}
			/>
			<TabMenu />
			<Router />
		</div>
	);
};

export default SideInnhold;
