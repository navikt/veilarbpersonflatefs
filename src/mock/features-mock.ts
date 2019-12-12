import {
    Features, SPOR_OM_TILBAKEMELDING,
    TOUR_MODAL_LAST_NED_CV_TOGGLE, TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE, VIS_NY_DIALOG, VIS_VEDTAKSSTOTTE
} from '../utils/featue-utils';
import { JSONObject } from 'yet-another-fetch-mock';

export default {
    [TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE]: true,
    [TOUR_MODAL_LAST_NED_CV_TOGGLE]: false,
    [SPOR_OM_TILBAKEMELDING]: true,
    [VIS_VEDTAKSSTOTTE]: true,
    [VIS_NY_DIALOG]: true,
} as Features & JSONObject;
