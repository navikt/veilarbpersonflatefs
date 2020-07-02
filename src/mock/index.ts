import FetchMock, { MiddlewareUtils } from 'yet-another-fetch-mock';
import {FEATURE_TOGGLE_URL, SIST_OPPDATERT_DIALOGER_URL, ULESTE_DIALOGER_URL} from '../utils/api';
import features from './features-mock';
import {antallUleste, sistOppdatert} from './dialoger-mock';
import { testBrukerFnr } from './kontekst';

const mock = FetchMock.configure({
	enableFallback: true,
	middleware: MiddlewareUtils.combine(MiddlewareUtils.delayMiddleware(500), MiddlewareUtils.loggingMiddleware())
});

window.history.replaceState('', '', '/veilarbpersonflatefs/' + testBrukerFnr + window.location.hash);

mock.get(FEATURE_TOGGLE_URL, features);
mock.get(ULESTE_DIALOGER_URL, antallUleste);
mock.get(SIST_OPPDATERT_DIALOGER_URL, sistOppdatert);
