import React from 'react';
import NAVSPA from '../utils/navspa';
import { DecoratorConfig } from './internflate-decorator/internflate-decorator-config';

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

export const Decorator: React.ComponentType<DecoratorConfig> = NAVSPA.importer<DecoratorConfig>(SpaName.INTERNARBEIDSFLATEFS_DECORATOR);
export const Visittkort: React.ComponentType<VisittKortProps> = NAVSPA.importer<VisittKortProps>(SpaName.VEILARBVISITTKORTFS);

export const MAO: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>(SpaName.VEILARBMAOFS, spaWrapperTabContentClassName);
export const Aktivitetsplan: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>(SpaName.AKTIVITETSPLAN, spaWrapperTabContentClassName);
export const Dialog: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>(SpaName.DIALOG, spaWrapperTabContentClassName);
export const Vedtaksstotte: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>(SpaName.VEILARBVEDTAKSSTOTTEFS, spaWrapperTabContentClassName);
