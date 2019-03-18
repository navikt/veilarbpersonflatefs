import { Features, NY_LAYOUT_TOGGLE, TOUR_MODAL_TOGGLE } from '../utils/api';
import { JSONObject } from 'yet-another-fetch-mock';

export default {
    [NY_LAYOUT_TOGGLE]: true,
    [TOUR_MODAL_TOGGLE]: true,
} as Features & JSONObject;
