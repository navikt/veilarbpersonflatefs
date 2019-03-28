
export const FEATURE_TOGGLE_URL = '/veilarbpersonflatefs/api/feature';
export const TOUR_MODAL_TOGGLE = 'veilarbpersonflatefs.tour_modal';
export const SPOR_OM_TILBAKEMELDING = 'veilarbpersonflatefs.spor_om_tilbakemelding';
export const ALL_TOGGLES = [TOUR_MODAL_TOGGLE, SPOR_OM_TILBAKEMELDING];

export const lagFeatureToggleUrl = () => {
    const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
    return `${FEATURE_TOGGLE_URL}/?${toggles}`;
};

export interface Features {
    [TOUR_MODAL_TOGGLE]: boolean;
    [SPOR_OM_TILBAKEMELDING]: boolean;
}
