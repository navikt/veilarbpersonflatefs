export const TOUR_MODAL_LAST_NED_CV_TOGGLE = 'veilarbpersonflatefs.tour_modal-last_ned_cv';
export const TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE = 'veilarbpersonflatefs.tour_modal.vedtaksstotte_lansering';
export const SPOR_OM_TILBAKEMELDING = 'veilarbpersonflatefs.spor_om_tilbakemelding';

export const ALL_TOGGLES = [
	TOUR_MODAL_LAST_NED_CV_TOGGLE,
	TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE,
	SPOR_OM_TILBAKEMELDING
];

export interface Features {
	[TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE]: boolean;
	[TOUR_MODAL_LAST_NED_CV_TOGGLE]: boolean;
	[SPOR_OM_TILBAKEMELDING]: boolean;
}
