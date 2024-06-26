import { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import React from 'react';
import { utledCDNSpaUrl, utledSpaUrl } from '../util/url-utils';
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
	INTERNARBEIDSFLATEFS_DECORATOR = 'internarbeidsflate-decorator-v3',
	AKTIVITETSPLAN = 'aktivitetsplan',
	DIALOG = 'arbeidsrettet-dialog',
	OVERBLIKK = 'veilarbdetaljerfs',
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
	appBaseUrl: utledCDNSpaUrl('poao', SpaName.VEILARBVISITTKORTFS),
	loader: <Spinner type="large" className="veilarbpersonflatefs-visittkort-spinner" />,

	assetManifestParser: manifest => {
		const isWebpackManifest = 'entrypoints' in manifest;
		const baseUrl = utledCDNSpaUrl('poao', SpaName.VEILARBVISITTKORTFS);
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

export const Visittkort: React.ComponentType<VisittKortProps> =
	AsyncNavspa.importer<VisittKortProps>(visittkortAsyncConfig);
