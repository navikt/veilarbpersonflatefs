import React from 'react';
import NAVSPA from '../utils/NAVSPA';

interface SpaProps {
    enhet?: string;
    fnr: string;
}

export const MAO: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('veilarbmaofs');
export const Aktivitetsplan: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('aktivitetsplan');
export const Visittkort: React.ComponentType<SpaProps> = NAVSPA.importer<SpaProps>('veilarbvisittkortfs');
