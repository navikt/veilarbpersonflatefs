import React from 'react';
import NAVSPA from '../utils/NAVSPA';

interface SpaProps {
    enhet?: string;
    fnr: string;
}

interface VisittKortProps extends SpaProps {
    tilbakeTilFlate: string;
    visVeilederVerktoy: boolean;
}

export const MAO: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('veilarbmaofs');
export const Aktivitetsplan: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('aktivitetsplan');
export const Dialog: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('arbeidsrettet-dialog');
export const Vedtaksstotte: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('veilarbvedtaksstottefs');
export const Visittkort: React.ComponentType<VisittKortProps> = NAVSPA.importer<VisittKortProps>('veilarbvisittkortfs');
