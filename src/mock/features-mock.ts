import { JSONObject } from 'yet-another-fetch-mock';
import {
	Features,
	SPOR_OM_TILBAKEMELDING,
	TOUR_MODAL_LAST_NED_CV_TOGGLE,
	TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE
} from '../api/features';

export default {
	[TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE]: true,
	[TOUR_MODAL_LAST_NED_CV_TOGGLE]: false,
	[SPOR_OM_TILBAKEMELDING]: true
} as Features & JSONObject;
