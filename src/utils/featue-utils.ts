import { FEATURE_TOGGLE_URL } from './api';

export const TOUR_MODAL_LAST_NED_CV_TOGGLE = 'veilarbpersonflatefs.tour_modal-last_ned_cv';
export const SPOR_OM_TILBAKEMELDING = 'veilarbpersonflatefs.spor_om_tilbakemelding';
export const VIS_VEDTAKSSTOTTE = 'veilarbpersonflatefs.vis_vedtaksstotte';
export const ALL_TOGGLES = [TOUR_MODAL_LAST_NED_CV_TOGGLE, SPOR_OM_TILBAKEMELDING, VIS_VEDTAKSSTOTTE];

export const lagFeatureToggleUrl = () => {
    const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
    return `${FEATURE_TOGGLE_URL}/?${toggles}`;
};

export interface Features {
    [TOUR_MODAL_LAST_NED_CV_TOGGLE]: boolean;
    [SPOR_OM_TILBAKEMELDING]: boolean;
    [VIS_VEDTAKSSTOTTE]: boolean;
}
