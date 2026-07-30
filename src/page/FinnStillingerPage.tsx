import React, { useEffect, useState } from 'react';
import { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import type { SpaProps } from '../component/spa';
import { SpaName, spaWrapperTabContentClassName } from '../util/utils';
import { utledSpaUrl } from '../util/url-utils';
import { useModiaContext } from '../store/modia-context-store';
import Spinner from '../component/spinner/spinner';

type Theme = 'light' | 'dark';

type FinnStillingProps = SpaProps & {
	theme: Theme;
};

const finnStillingInngangAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.FINN_STILLING_INNGANG,
	appBaseUrl: utledSpaUrl(SpaName.FINN_STILLING_INNGANG),
	loader: <Spinner />,
	config: {
		wrapperClassName: spaWrapperTabContentClassName
	},
	assetManifestParser: manifest => {
		const { file, css } = manifest['index.html'];
		const baseUrl = utledSpaUrl(SpaName.FINN_STILLING_INNGANG);

		const entry = { type: 'module', path: `${baseUrl}/${file}` };
		const styles = css ? css.map((path: string) => ({ path: `${baseUrl}/${path}` })) : [];

		return [entry, ...styles];
	}
};

const FinnStillingInngang: React.ComponentType<FinnStillingProps> =
	AsyncNavspa.importer<FinnStillingProps>(finnStillingInngangAsyncConfig);

const FinnStillingerPage = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	const [theme, setTheme] = useState<Theme>('light');

	useEffect(() => {
		const syncTheme = () => {
			setTheme(document.body.classList.contains('dark') ? 'dark' : 'light');
		};

		syncTheme();

		const observer = new MutationObserver(syncTheme);
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return <FinnStillingInngang fnr={aktivBrukerFnr} enhet={aktivEnhetId ?? undefined} theme={theme} />;
};

export default FinnStillingerPage;
