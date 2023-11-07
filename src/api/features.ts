export const TOUR_MODAL_LAST_NED_CV_TOGGLE = 'veilarbpersonflatefs.tour_modal-last_ned_cv';
export const TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE = 'veilarbpersonflatefs.tour_modal.vedtaksstotte_lansering';
export const SPOR_OM_TILBAKEMELDING = 'veilarbpersonflatefs.spor_om_tilbakemelding';
export const ARBEIDSMARKEDSTILTAK_LANSERING = 'mulighetsrommet-veileder-flate.lansering';
export const VEILARBDETALJERFS_ENABLED = 'veilarbpersonflatefs.veilarbdetaljerfs-enabled';
export const FINN_STILLING_INNGANG_ENABLED = 'veilarbpersonflatefs.finn-stilling-inngang-enabled';

export const OBO_UNLEASH_TOGGLES = [
	VEILARBDETALJERFS_ENABLED
]

export const ALL_TOGGLES = [
	TOUR_MODAL_LAST_NED_CV_TOGGLE,
	TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE,
	SPOR_OM_TILBAKEMELDING,
	ARBEIDSMARKEDSTILTAK_LANSERING,
	FINN_STILLING_INNGANG_ENABLED
];

export interface Features {
	[TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE]: boolean;
	[TOUR_MODAL_LAST_NED_CV_TOGGLE]: boolean;
	[SPOR_OM_TILBAKEMELDING]: boolean;
	[ARBEIDSMARKEDSTILTAK_LANSERING]: boolean;
	[FINN_STILLING_INNGANG_ENABLED]: boolean;
}

export interface OboUnleashFeatures {
	[VEILARBDETALJERFS_ENABLED]: boolean;
}