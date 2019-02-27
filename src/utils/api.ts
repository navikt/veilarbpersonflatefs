
export const FEATURE_TOGGLE_URL = '/veilarbpersonflatefs/api/feature';
export const NY_LAYOUT_TOGGLE = 'modia.layout_med_visittkort';
export const ALL_TOGGLES = [NY_LAYOUT_TOGGLE];

export const lagFeatureToggleUrl = () => {
    const toggles = ALL_TOGGLES.map(element => 'feature=' + element).join('&');
    return `${FEATURE_TOGGLE_URL}/?${toggles}`;
};

export interface Features {
    [NY_LAYOUT_TOGGLE]: boolean;
}
