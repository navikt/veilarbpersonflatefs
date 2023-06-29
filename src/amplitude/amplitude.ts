import * as amplitude from '@amplitude/analytics-browser';
import { track } from '@amplitude/analytics-browser';
import { Env, getEnv } from '../util/utils';
import { TabId } from '../component/side-innhold';

export function initAmplitude() {
    const apiKey = getEnv() === Env.Prod
            ? '691963e61d2b11465aa96acfcaa8959b'
            : 'faf28eb5445abfe75c7ac28ae7a8d050';

    amplitude.init(apiKey, undefined, {
        serverUrl: 'https://amplitude.nav.no/collect',
        ingestionMetadata: {
            sourceName: window.location.toString(),
        },
    });

    window.veilarbpersonflatefsAmplitude = logEventFromApp;
}

function logEventFromApp(params?: {
    origin: unknown | string;
    eventName: unknown | string;
    eventData?: unknown | Record<string, unknown>;
}): Promise<void> {
    try {
        if (!params || params.constructor !== Object) {
            return Promise.reject(
                'Argument must be an object of type {origin: string, eventName: string, eventData?: Record<string, unknown>}'
            );
        }

        const { origin, eventName, eventData = {} } = params;
        if (!eventName || typeof eventName !== 'string') {
            return Promise.reject('Parameter "eventName" must be a string');
        }
        if (!eventData || eventData.constructor !== Object) {
            return Promise.reject('Parameter "eventData" must be a plain object');
        }
        if (!origin || typeof origin !== 'string') {
            return Promise.reject('Parameter "origin" must be a string');
        }

        return logAmplitudeEvent(eventName, eventData as Record<string, unknown>, origin);
    } catch (e) {
        return Promise.reject(`Unexpected Amplitude error: ${e}`);
    }
}

async function logAmplitudeEvent(eventName: string, eventData?: Record<string, unknown>, origin = 'veilarbpersonflatefs'): Promise<void> {
    try {
        track(eventName, { ...eventData, app: origin });
    } catch (e) { /* empty */ }
}

export function logValgtFane(tabId: TabId) {
    return logAmplitudeEvent('tab åpnet', { tabId });
}
