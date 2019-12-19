import React from 'react';
import NAVSPA from '../utils/navspa';

interface SpaProps {
	enhet?: string;
	fnr: string;
}

interface VisittKortProps extends SpaProps {
	tilbakeTilFlate: string;
	visVeilederVerktoy: boolean;
}

export enum SpaName {
	VEILARBMAOFS = 'veilarbmaofs',
	AKTIVITETSPLAN = 'aktivitetsplan',
	DIALOG = 'arbeidsrettet-dialog',
	VEILARBVEDTAKSSTOTTEFS = 'veilarbvedtaksstottefs',
	VEILARBVISITTKORTFS = 'veilarbvisittkortfs'
}

export const tabContentSpaAppWrapperClassName = 'tab-menu__tab-content-app';

export const MAO: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>(SpaName.VEILARBMAOFS, tabContentSpaAppWrapperClassName);
export const Aktivitetsplan: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>(SpaName.AKTIVITETSPLAN, tabContentSpaAppWrapperClassName);
export const Dialog: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>(SpaName.DIALOG, tabContentSpaAppWrapperClassName);
export const Vedtaksstotte: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>(SpaName.VEILARBVEDTAKSSTOTTEFS, tabContentSpaAppWrapperClassName);
export const Visittkort: React.ComponentType<VisittKortProps> = NAVSPA.importer<VisittKortProps>(SpaName.VEILARBVISITTKORTFS);
