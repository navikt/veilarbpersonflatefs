import { AsyncSpaConfig } from '@navikt/navspa';
import React from 'react';
import { utledOboCdnUrl } from '../util/url-utils';
import { SpaName, spaWrapperTabContentClassName } from '../util/utils';
import Spinner from './spinner/spinner';

export interface SpaProps {
	enhet?: string;
	fnr: string;
}

export const vedtaksstotteAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVEDTAKSSTOTTEFS,
	appBaseUrl: utledOboCdnUrl('veilarbvedtaksstottefs/dist'),
	loader: <Spinner />,
	config: {
		wrapperClassName: spaWrapperTabContentClassName
	},
	assetManifestParser: manifest => {
		const { file, css } = manifest['index.html'];
		const baseUrl = utledOboCdnUrl('veilarbvedtaksstottefs/dist');
		const entry = { type: 'module', path: `${baseUrl}/${file}` };
		const styles = css.map((path: string) => ({ path: `${baseUrl}/${path}` }));
		return [entry, ...styles];
	}
};
