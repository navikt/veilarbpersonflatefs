export const ARBEIDSMARKEDSTILTAK_LANSERING = 'mulighetsrommet-veileder-flate.lansering';
export const VIS_GAMLE_DETALJER_FANE = 'veilarbpersonflatefs.vis-gamle-detaljer-fane';

export const OBO_UNLEASH_TOGGLES = [VIS_GAMLE_DETALJER_FANE];

export const ALL_TOGGLES = [ARBEIDSMARKEDSTILTAK_LANSERING];

export interface Features {
	[ARBEIDSMARKEDSTILTAK_LANSERING]: boolean;
}

export interface OboUnleashFeatures {
	[VIS_GAMLE_DETALJER_FANE]: boolean;
}
