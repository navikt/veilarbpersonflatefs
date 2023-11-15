export const ARBEIDSMARKEDSTILTAK_LANSERING = 'mulighetsrommet-veileder-flate.lansering';
export const VEILARBDETALJERFS_ENABLED = 'veilarbpersonflatefs.veilarbdetaljerfs-enabled';

export const OBO_UNLEASH_TOGGLES = [
	VEILARBDETALJERFS_ENABLED
]

export const ALL_TOGGLES = [
	ARBEIDSMARKEDSTILTAK_LANSERING,
];

export interface Features {
	[ARBEIDSMARKEDSTILTAK_LANSERING]: boolean;
}

export interface OboUnleashFeatures {
	[VEILARBDETALJERFS_ENABLED]: boolean;
}