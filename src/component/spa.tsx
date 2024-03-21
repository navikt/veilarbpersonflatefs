import NAVSPA, { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import React from 'react';
import { utledSpaUrl } from '../util/url-utils';
import { DecoratorConfig } from './internflate-decorator/internflate-decorator-config';
import Spinner from './spinner/spinner';
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
	ARBEIDSMARKEDSTILTAK = 'arbeidsmarkedstiltak-modia',
	VEILARBDETALJER = 'veilarbdetaljer',
	FINN_STILLING_INNGANG = 'finn-stilling-inngang'
}

export const spaWrapperTabContentClassName = 'spa-wrapper__tab-content';

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
export const Decorator: React.ComponentType<DecoratorConfig> = NAVSPA.importer(SpaName.INTERNARBEIDSFLATEFS_DECORATOR, {
	wrapperClassName: ''
});

export const Visittkort: React.ComponentType<VisittKortProps> =
	AsyncNavspa.importer<VisittKortProps>(visittkortAsyncConfig);
