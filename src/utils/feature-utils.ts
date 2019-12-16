import { FEATURE_TOGGLE_URL } from './api';

export const TOUR_MODAL_LAST_NED_CV_TOGGLE = 'veilarbpersonflatefs.tour_modal-last_ned_cv';
export const TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE = 'veilarbpersonflatefs.tour_modal.vedtaksstotte_lansering';

export const SPOR_OM_TILBAKEMELDING = 'veilarbpersonflatefs.spor_om_tilbakemelding';
export const VIS_NY_DIALOG = 'veilarbpersonflatefs.vis_ny_dialog';

export const ALL_TOGGLES = [
    TOUR_MODAL_LAST_NED_CV_TOGGLE,
    TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE,
    SPOR_OM_TILBAKEMELDING,
    VIS_NY_DIALOG,
];

export const lagFeatureToggleUrl = () => {
    const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
    return `${FEATURE_TOGGLE_URL}/?${toggles}`;
};

export interface Features {
    [TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE]: boolean;
    [TOUR_MODAL_LAST_NED_CV_TOGGLE]: boolean;
    [SPOR_OM_TILBAKEMELDING]: boolean;
    [VIS_NY_DIALOG]: boolean;
}
