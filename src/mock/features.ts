import { Features, SPOR_OM_TILBAKEMELDING, TOUR_MODAL_TOGGLE } from '../utils/api';
import { JSONObject } from 'yet-another-fetch-mock';

export default {
    [TOUR_MODAL_TOGGLE]: true,
    [SPOR_OM_TILBAKEMELDING]: true,
} as Features & JSONObject;
