import NAVSPA, { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import React, { useEffect, useState } from 'react';
import { utledCdnUrl, utledSpaUrl } from '../util/url-utils';
import { DecoratorConfig } from './internflate-decorator/internflate-decorator-config';
import Spinner from './spinner/spinner';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { Env, getEnv } from '../util/utils';
import { createAssetManifestParser } from '@navikt/navspa/dist/async/utils';
import { Loader } from '@navikt/ds-react';

export interface SpaProps {
	enhet?: string;
	fnr: string;
}

interface VisittKortProps extends SpaProps {
	tilbakeTilFlate: string;
	visVeilederVerktoy: boolean;
}

export enum SpaName {
	INTERNARBEIDSFLATEFS_DECORATOR = 'internarbeidsflatefs',
	VEILARBMAOFS = 'veilarbmaofs',
	AKTIVITETSPLAN = 'aktivitetsplan',
	DIALOG = 'arbeidsrettet-dialog',
	VEILARBVEDTAKSSTOTTEFS = 'veilarbvedtaksstottefs',
	VEILARBVISITTKORTFS = 'veilarbvisittkortfs',
	ARBEIDSMARKEDSTILTAK = 'arbeidsmarkedstiltak-modia',
	VEILARBDETALJER = 'veilarbdetaljer',
	FINN_STILLING_INNGANG = 'finn-stilling-inngang'
}

const dabCdnUrl = 'https://cdn.nav.no/dab';

export const spaWrapperTabContentClassName = 'spa-wrapper__tab-content';

export const detaljerAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBMAOFS,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBMAOFS),
	loader: <Spinner />,
	config: {
		wrapperClassName: spaWrapperTabContentClassName
	}
};

const veilarbdetaljerBaseUrl = utledSpaUrl(SpaName.VEILARBDETALJER);
const veilarbdetaljerManifestParser: AssetManifestParser = manifest => {
	const { file } = manifest['index.html'];
	const entry = { type: 'module', path: `${veilarbdetaljerBaseUrl}/${file}` };
	return [entry];
};
export const DetaljerNy: React.ComponentType<SpaProps> = props => {
	useEffect(() => {
		loadAssets({
			appName: SpaName.VEILARBDETALJER,
			appBaseUrl: veilarbdetaljerBaseUrl,
			assetManifestParser: veilarbdetaljerManifestParser
		});
	}, []);
	return React.createElement('veilarb-detaljer', { ['data-fnr']: props.fnr });
};

export const vedtaksstotteAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVEDTAKSSTOTTEFS,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBVEDTAKSSTOTTEFS),
	loader: <Spinner />,
	config: {
		wrapperClassName: spaWrapperTabContentClassName
	}
};

export const visittkortAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVISITTKORTFS,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBVISITTKORTFS),
	loader: <Spinner type="large" className="veilarbpersonflatefs-visittkort-spinner" />,

	assetManifestParser: manifest => {
		const isWebpackManifest = 'entrypoints' in manifest;
		const baseUrl = utledSpaUrl(SpaName.VEILARBVISITTKORTFS);
		if (isWebpackManifest) {
			return createAssetManifestParser(baseUrl)(manifest);
		} else {
			// Vitejs manifest
			const { file, css } = manifest['index.html'];
			const styles = css.map((path: string) => ({ path: `${baseUrl}/${path}` }));
			const entry = { type: 'module', path: `${baseUrl}/${file}` };
			return [entry, ...styles];
		}
	}
};

const aktivitetsplanCdnUrl =
	getEnv() === Env.Prod
		? `${dabCdnUrl}/aktivitetsplan-prod-intern/build`
		: `${dabCdnUrl}/aktivitetsplan-dev-intern/build`;
const aktivitetsplanManifestParser: AssetManifestParser = manifest => {
	const { file } = manifest['index.html'];
	const entry = { type: 'module', path: `${aktivitetsplanCdnUrl}/${file}` };
	return [entry];
};
export const Aktivitetsplan: React.ComponentType<SpaProps> = props => {
	useEffect(() => {
		loadAssets({
			appName: SpaName.AKTIVITETSPLAN,
			appBaseUrl: aktivitetsplanCdnUrl,
			assetManifestParser: aktivitetsplanManifestParser
		});
	}, []);
	return React.createElement('dab-aktivitetsplan', { ['data-fnr']: props.fnr });
};

const dialogCdnUrl =
	getEnv() === Env.Prod
		? `${dabCdnUrl}/arbeidsrettet-dialog-prod-intern/build`
		: `${dabCdnUrl}/arbeidsrettet-dialog-dev-intern/build`;
const dialogManifestParser: AssetManifestParser = manifest => {
	const { file } = manifest['index.html'];
	const entry = { type: 'module', path: `${dialogCdnUrl}/${file}` };
	return [entry];
};
export const Dialog: React.ComponentType<SpaProps> = props => {
	useEffect(() => {
		loadAssets({
			appName: SpaName.DIALOG,
			appBaseUrl: dialogCdnUrl,
			assetManifestParser: dialogManifestParser
		});
	}, []);
	return React.createElement('dab-dialog', { ['data-fnr']: props.fnr });
};

const arbeidsmarkedstiltakBaseUrl = utledCdnUrl('mulighetsrommet/arbeidsmarkedstiltak-modia/dist');
const arbeidsmarkedstiltakManifestParser: AssetManifestParser = manifest => {
	const { file } = manifest['index.html'];
	const entry = { type: 'module', path: `${arbeidsmarkedstiltakBaseUrl}/${file}` };
	return [entry];
};
export const Arbeidsmarkedstiltak: React.ComponentType<SpaProps> = props => {
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		loadAssets({
			appName: SpaName.ARBEIDSMARKEDSTILTAK,
			appBaseUrl: arbeidsmarkedstiltakBaseUrl,
			assetManifestParser: arbeidsmarkedstiltakManifestParser
		}).finally(() => setIsLoading(false));
	}, []);
	return isLoading ? (
		<Loader>Laster...</Loader>
	) : (
		React.createElement('mulighetsrommet-arbeidsmarkedstiltak', {
			'data-fnr': props.fnr,
			'data-enhet': props.enhet
		})
	);
};

export const finnStillingInngangAsyncConfig: AsyncSpaConfig = {
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

export const Decorator: React.ComponentType<DecoratorConfig> = NAVSPA.importer(SpaName.INTERNARBEIDSFLATEFS_DECORATOR, {
	wrapperClassName: ''
});

export const Visittkort: React.ComponentType<VisittKortProps> =
	AsyncNavspa.importer<VisittKortProps>(visittkortAsyncConfig);
export const Detaljer: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(detaljerAsyncConfig);
export const Vedtaksstotte: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(vedtaksstotteAsyncConfig);
export const FinnStillingInngang: React.ComponentType<SpaProps> =
	AsyncNavspa.importer<SpaProps>(finnStillingInngangAsyncConfig);
