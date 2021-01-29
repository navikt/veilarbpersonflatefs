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
	VEILARBVISITTKORTFS = 'veilarbvisittkortfs'
}

export const spaWrapperTabContentClassName = 'spa-wrapper__tab-content';

export const detaljerAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBMAOFS,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBMAOFS),
	wrapperClassName: spaWrapperTabContentClassName,
	loader: <Spinner/>
}

export const visittkortAsyncConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVISITTKORTFS,
	appBaseUrl: utledSpaUrl(SpaName.VEILARBVISITTKORTFS),
	loader: <Spinner/>
}

export const Decorator: React.ComponentType<DecoratorConfig> = navSpaImport<DecoratorConfig>(SpaName.INTERNARBEIDSFLATEFS_DECORATOR);
export const Visittkort: React.ComponentType<VisittKortProps> = AsyncNavspa.importer<VisittKortProps>(visittkortAsyncConfig);
export const Aktivitetsplan: React.ComponentType<SpaProps> = navSpaImport<SpaProps>(SpaName.AKTIVITETSPLAN, spaWrapperTabContentClassName);
export const Dialog: React.ComponentType<SpaProps> = navSpaImport<SpaProps>(SpaName.DIALOG, spaWrapperTabContentClassName);
export const Detaljer: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(detaljerAsyncConfig);
export const Vedtaksstotte: React.ComponentType<SpaProps> = navSpaImport<SpaProps>(SpaName.VEILARBVEDTAKSSTOTTEFS, spaWrapperTabContentClassName);

function navSpaImport<P>(spaName: SpaName, wrapperClassName?: string): React.FunctionComponent<P> {
	return (props: P) => {
		const SpaApp = Navspa.importer<P>(spaName);
		return (
			<div className={wrapperClassName}>
				<SpaApp {...props}/>
			</div>
		);
	};
}
