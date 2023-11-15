export const ARBEIDSMARKEDSTILTAK_LANSERING = 'mulighetsrommet-veileder-flate.lansering';
export const VEILARBDETALJERFS_ENABLED = 'veilarbpersonflatefs.veilarbdetaljerfs-enabled';
export const FINN_STILLING_INNGANG_ENABLED = 'veilarbpersonflatefs.finn-stilling-inngang-enabled';

export const OBO_UNLEASH_TOGGLES = [
	VEILARBDETALJERFS_ENABLED
]

export const ALL_TOGGLES = [
	ARBEIDSMARKEDSTILTAK_LANSERING,
	FINN_STILLING_INNGANG_ENABLED
];

export interface Features {
	[ARBEIDSMARKEDSTILTAK_LANSERING]: boolean;
	[FINN_STILLING_INNGANG_ENABLED]: boolean;
}

export interface OboUnleashFeatures {
	[VEILARBDETALJERFS_ENABLED]: boolean;
}