import React from 'react';
import NAVSPA from '../utils/NAVSPA';

interface SpaProps {
    enhet?: string;
    fnr: string;
}

interface VisittKortProps extends SpaProps {
    tilbakeTilFlate: string;
}

export const MAO: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('veilarbmaofs');
export const Aktivitetsplan: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('aktivitetsplan');
export const Visittkort: React.ComponentType<VisittKortProps> = NAVSPA.importer<VisittKortProps>('veilarbvisittkortfs');
