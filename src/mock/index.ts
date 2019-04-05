import FetchMock, { Middleware, MiddlewareUtils } from 'yet-another-fetch-mock';
import { FEATURE_TOGGLE_URL, ULESTE_DIALOGER_URL } from '../utils/api';
import features from './features-mock';
import ulesteDialoger from './uleste-dialoger-mock';

const loggingMiddleware: Middleware = (request, response) => {
    // tslint:disable
    console.groupCollapsed(request.url);
    console.groupCollapsed('config');
    console.log('url', request.url);
    console.log('queryParams', request.queryParams);
    console.log('pathParams', request.pathParams);
    console.log('body', request.body);
    console.groupEnd();

    try {
        console.log('response', JSON.parse(response.body));
    } catch (e) {
        console.log('response', response);
    }

    console.groupEnd();
    // tslint:enable
    return response;
};

const mock = FetchMock.configure({
    enableFallback: true,
    middleware: MiddlewareUtils.combine(
        MiddlewareUtils.delayMiddleware(500),
        loggingMiddleware
    )
});

mock.get(FEATURE_TOGGLE_URL, features);

mock.get(ULESTE_DIALOGER_URL, ulesteDialoger);
