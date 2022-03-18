import React from 'react';
import { Navspa, AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import { DecoratorConfig } from './internflate-decorator/internflate-decorator-config';
import Spinner from './spinner/spinner';
import { utledSpaUrl } from '../util/url-utils';

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
	wrapperClassName: spaWrapperTabContentClassName,
	loader: <Spinner />
};

export const vedtaksstotteAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVEDTAKSSTOTTEFS,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBVEDTAKSSTOTTEFS),
	wrapperClassName: spaWrapperTabContentClassName,
	loader: <Spinner />
};

export const visittkortAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVISITTKORTFS,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBVISITTKORTFS),
	loader: <Spinner type="L" className="veilarbpersonflatefs-visittkort-spinner" />
};

export const aktivitetsplanAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.AKTIVITETSPLAN,
	appBaseUrl: utledSpaUrl(SpaName.AKTIVITETSPLAN),
	wrapperClassName: spaWrapperTabContentClassName,
	loader: <Spinner type="L" className="veilarbpersonflatefs-visittkort-spinner" />
};

export const dialogAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.DIALOG,
	appBaseUrl: utledSpaUrl(SpaName.DIALOG) + '/arbeid/dialog',
	wrapperClassName: spaWrapperTabContentClassNameDialog,
	loader: <Spinner type="L" className="veilarbpersonflatefs-visittkort-spinner" />
};

export const arbeidsmarkedstiltakAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.ARBEIDSMARKEDSTILTAK,
	appBaseUrl: utledSpaUrl(SpaName.ARBEIDSMARKEDSTILTAK),
	wrapperClassName: spaWrapperTabContentClassName,
	loader: <Spinner type="L" className="veilarbpersonflatefs-visittkort-spinner" />
};

export const Decorator: React.ComponentType<DecoratorConfig> = navSpaImport<DecoratorConfig>(
	SpaName.INTERNARBEIDSFLATEFS_DECORATOR
);

export const Visittkort: React.ComponentType<VisittKortProps> = AsyncNavspa.importer<VisittKortProps>(
	visittkortAsyncConfig
);
export const Aktivitetsplan: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(aktivitetsplanAsyncConfig);
export const Dialog: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(dialogAsyncConfig);
export const Detaljer: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(detaljerAsyncConfig);
export const Vedtaksstotte: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(vedtaksstotteAsyncConfig);
export const Arbeidsmarkedstiltak: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(
	arbeidsmarkedstiltakAsyncConfig
);

function navSpaImport<P>(spaName: SpaName, wrapperClassName?: string): React.FunctionComponent<P> {
	return (props: P) => {
		const SpaApp = Navspa.importer<P>(spaName);
		return (
			<div className={wrapperClassName}>
				<SpaApp {...props} />
			</div>
		);
	};
}
