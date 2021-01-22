import React from 'react';
import { Navspa, AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import { DecoratorConfig } from './internflate-decorator/internflate-decorator-config';
import { veilarbvedtaksstotteUrl } from '../util/url-utils';
import Spinner from './spinner/spinner';

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

export const Decorator: React.ComponentType<DecoratorConfig> = Navspa.importer<DecoratorConfig>(SpaName.INTERNARBEIDSFLATEFS_DECORATOR);
export const Visittkort: React.ComponentType<VisittKortProps> = Navspa.importer<VisittKortProps>(SpaName.VEILARBVISITTKORTFS);

export const MAO: React.ComponentType<SpaProps> = Navspa.importer<SpaProps>(SpaName.VEILARBMAOFS, spaWrapperTabContentClassName);
export const Aktivitetsplan: React.ComponentType<SpaProps> = Navspa.importer<SpaProps>(SpaName.AKTIVITETSPLAN, spaWrapperTabContentClassName);
export const Dialog: React.ComponentType<SpaProps> = Navspa.importer<SpaProps>(SpaName.DIALOG, spaWrapperTabContentClassName);

export const vedtaksstotteConfig: AsyncSpaConfig = {
	appName: SpaName.VEILARBVEDTAKSSTOTTEFS,
	appBaseUrl: veilarbvedtaksstotteUrl(),
	wrapperClassName: spaWrapperTabContentClassName,
	loader: <Spinner/>
};

export const Vedtaksstotte: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(vedtaksstotteConfig);
