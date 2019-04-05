import { Features, SPOR_OM_TILBAKEMELDING, TOUR_MODAL_TOGGLE, VIS_VEDTAKSSTOTTE } from '../utils/featue-utils';
import { JSONObject } from 'yet-another-fetch-mock';

export default {
    [TOUR_MODAL_TOGGLE]: true,
    [SPOR_OM_TILBAKEMELDING]: true,
    [VIS_VEDTAKSSTOTTE]: true,
} as Features & JSONObject;
