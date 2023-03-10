import { AsyncNavspa, AsyncSpaConfig, Navspa } from '@navikt/navspa';
import React, {useEffect} from 'react';
import { utledSpaUrl } from '../util/url-utils';
import { DecoratorConfig } from './internflate-decorator/internflate-decorator-config';
import Spinner from './spinner/spinner';
import {createAssetManifestParser} from "@navikt/navspa/dist/async/utils";
import {loadAssets} from "@navikt/navspa/dist/async/async-navspa";

interface SpaProps {
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
	ARBEIDSMARKEDSTILTAK = 'mulighetsrommet-veileder-flate'
}

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
	loader: <Spinner type="L" className="veilarbpersonflatefs-visittkort-spinner" />
};

export const aktivitetsplanAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.AKTIVITETSPLAN,
	appBaseUrl: utledSpaUrl(SpaName.AKTIVITETSPLAN),
	loader: <Spinner type="L" className="veilarbpersonflatefs-visittkort-spinner" />,
	config: {
		wrapperClassName: spaWrapperTabContentClassName
	},
	assetManifestParser: manifest => {
		const isWebpackManifeset = 'entrypoints' in manifest
		const baseUrl = utledSpaUrl(SpaName.AKTIVITETSPLAN)
		if (isWebpackManifeset) {
			return createAssetManifestParser(baseUrl)(manifest)
		} else { // Vitejs manifest
			const { file, css } = manifest['index.html'];
			const entry = { type: 'module', path: `${baseUrl}/${file}` };
			const styles = css.map((path: string) => ({ path: `${baseUrl}/${path}` }));
			return [entry, ...styles];
		}
	}
};

export const dialogAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.DIALOG,
	appBaseUrl: utledSpaUrl(SpaName.DIALOG) + '/arbeid/dialog',
	loader: <Spinner type="L" className="veilarbpersonflatefs-visittkort-spinner" />,
	config: {
		wrapperClassName: spaWrapperTabContentClassNameDialog
	}
};

export const arbeidsmarkedstiltakAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.ARBEIDSMARKEDSTILTAK,
	appBaseUrl: utledSpaUrl(SpaName.ARBEIDSMARKEDSTILTAK),
	loader: <Spinner type="L" className="veilarbpersonflatefs-visittkort-spinner" />,
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

export const Decorator: React.ComponentType<DecoratorConfig> = navSpaImport<DecoratorConfig>(
	SpaName.INTERNARBEIDSFLATEFS_DECORATOR
);

export const Visittkort: React.ComponentType<VisittKortProps> =
	AsyncNavspa.importer<VisittKortProps>(visittkortAsyncConfig);

let hasLoadedAssets = false
const AktivitetsplanWebcomponent = ({ fnr }: SpaProps) => {
	useEffect(() => {
		if (hasLoadedAssets) return
		loadAssets(aktivitetsplanAsyncConfig)
		hasLoadedAssets = true
	}, [])
	return React.createElement('dab-aktivitetsplan', {
		// eslint-disable-next-line
		['data-fnr']: fnr
	})
}
export const Aktivitetsplan: React.ComponentType<SpaProps> = AktivitetsplanWebcomponent //AsyncNavspa.importer<SpaProps>(aktivitetsplanAsyncConfig);
export const Dialog: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(dialogAsyncConfig);
export const Detaljer: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(detaljerAsyncConfig);
export const Vedtaksstotte: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(vedtaksstotteAsyncConfig);
export const Arbeidsmarkedstiltak: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(
	arbeidsmarkedstiltakAsyncConfig
);

function navSpaImport<P extends {}>(spaName: SpaName, wrapperClassName?: string): React.FunctionComponent<P> {
	return (props: P) => {
		const SpaApp = Navspa.importer<P>(spaName);
		return (
			<div className={wrapperClassName}>
				<SpaApp {...props} />
			</div>
		);
	};
}
