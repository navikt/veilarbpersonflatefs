import { Features, NY_LAYOUT_TOGGLE } from '../utils/api';
import { JSONObject } from 'yet-another-fetch-mock';

export default {
    [NY_LAYOUT_TOGGLE]: true,
} as Features & JSONObject;
