import NAVSPA, { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import React, { useEffect } from 'react';
import { utledSpaUrl } from '../util/url-utils';
import { DecoratorConfig } from './internflate-decorator/internflate-decorator-config';
import Spinner from './spinner/spinner';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { Env, getEnv } from '../util/utils';
import { createAssetManifestParser } from '@navikt/navspa/dist/async/utils';

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
	ARBEIDSMARKEDSTILTAK = 'mulighetsrommet-veileder-flate',
	VEILARBDETALJER = 'veilarbdetaljer',
	FINN_STILLING_INNGANG = 'finn-stilling-inngang'
}

const dabCdnUrl = 'https://cdn.nav.no/dab';
const dabStorageUrl = 'https://storage.googleapis.com/frontend-plattform-prod-dab/dab';

export const spaWrapperTabContentClassName = 'spa-wrapper__tab-content';
export const spaWrapperTabContentClassNameDialog = 'spa-wrapper__tab-content-dialog';

export const detaljerAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBMAOFS,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBMAOFS),
	loader: <Spinner />,
	config: {
		wrapperClassName: spaWrapperTabContentClassName
	}
};

export const detaljerNyAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBDETALJER,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBDETALJER),
	loader: <Spinner />,
	config: {
		wrapperClassName: spaWrapperTabContentClassName
	},
	assetManifestParser: manifest => {
		const { file, css } = manifest['index.html'];
		const baseUrl = utledSpaUrl(SpaName.VEILARBDETALJER);

		const entry = { type: 'module', path: `${baseUrl}/${file}` };
		const styles = css ? css.map((path: string) => ({ path: `${baseUrl}/${path}` })) : [];

		return [entry, ...styles];
	}
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
// Don't use CDN to get asset-manifest because caching takes ~15++++ minutes to purge
const aktivitetsplanBucketUrl =
	getEnv() === Env.Prod
		? `${dabStorageUrl}/aktivitetsplan-prod-intern/build`
		: `${dabStorageUrl}/aktivitetsplan-dev-intern/build`;

const aktivitetsplanManifestParser: AssetManifestParser = manifest => {
	const { file } = manifest['index.html'];
	const entry = { type: 'module', path: `${aktivitetsplanCdnUrl}/${file}` };
	return [entry];
};
export const Aktivitetsplan: React.ComponentType<SpaProps> = props => {
	useEffect(() => {
		loadAssets({
			appName: SpaName.AKTIVITETSPLAN,
			appBaseUrl: aktivitetsplanBucketUrl,
			assetManifestParser: aktivitetsplanManifestParser
		});
	}, []);
	return React.createElement('dab-aktivitetsplan', {
		['data-fnr']: props.fnr
	});
};

const dialogCdnUrl =
	getEnv() === Env.Prod
		? `${dabCdnUrl}/arbeidsrettet-dialog-prod-intern/build`
		: `${dabCdnUrl}/arbeidsrettet-dialog-dev-intern/build`;

export const dialogAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.DIALOG,
	appBaseUrl: dialogCdnUrl,
	loader: <Spinner type="large" className="veilarbpersonflatefs-visittkort-spinner" />,
	config: {
		wrapperClassName: spaWrapperTabContentClassNameDialog
	},
	assetManifestParser: manifest => {
		const { file } = manifest['index.html'];
		const entry = { type: 'module', path: `${dialogCdnUrl}/${file}` };
		return [entry];
	}
};

export const arbeidsmarkedstiltakAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.ARBEIDSMARKEDSTILTAK,
	appBaseUrl: utledSpaUrl(SpaName.ARBEIDSMARKEDSTILTAK),
	loader: <Spinner type="large" className="veilarbpersonflatefs-visittkort-spinner" />,
	config: {
		wrapperClassName: spaWrapperTabContentClassName
	},
	assetManifestParser: manifest => {
		const { file, css } = manifest['index.html'];
		const baseUrl = utledSpaUrl(SpaName.ARBEIDSMARKEDSTILTAK);

		const entry = { type: 'module', path: `${baseUrl}/${file}` };
		const styles = css.map((path: string) => ({ path: `${baseUrl}/${path}` }));

		return [entry, ...styles];
	}
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
export const Dialog: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(dialogAsyncConfig);
export const Detaljer: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(detaljerAsyncConfig);
export const DetaljerNy: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(detaljerNyAsyncConfig);
export const Vedtaksstotte: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(vedtaksstotteAsyncConfig);
export const Arbeidsmarkedstiltak: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(
	arbeidsmarkedstiltakAsyncConfig
);
export const FinnStillingInngang: React.ComponentType<SpaProps> =
	AsyncNavspa.importer<SpaProps>(finnStillingInngangAsyncConfig);
