interface Handlers {
    [s: string]: PromiseHandler[];
}

interface PromiseHandler {
    resolve?: (res: Response) => void;
    reject?: (error: any) => void;
}

const normalFetch = window.fetch;
const handlers: Handlers = {};


const createRequestKey = (url: string, method: string, body: BodyInit): string => {
    return [url, method.toUpperCase(), body].join('|');
};

const hasRequestsInFlight = (requestKey: string): boolean => {
    return handlers[requestKey] && handlers[requestKey].length > 0;
};

const addHandler = (handler: PromiseHandler, requestKey: string): void => {
    if (!handlers[requestKey]) {
        handlers[requestKey] = [];
    }

    handlers[requestKey].push(handler);
};

const resolveRequestHandlers = (response: Response, requestKey: string): void => {
    handlers[requestKey].forEach(requestHandler => {
        if (requestHandler.resolve) {
            requestHandler.resolve(response.clone());
        }
    });
};

const rejecteRequestHandlers = (error: any, requestKey: string): void => {
    handlers[requestKey].forEach(requestHandler => {
        if (requestHandler.reject) {
            requestHandler.reject(error);
        }
    });
};

const fetchDedupe = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const inputRequest = input as Request;
    const url = inputRequest.url ? inputRequest.url : input as string;
    const method = init && init.method ? init.method : '';
    const body = init && init.body ? init.body : '';

    const requestKey = createRequestKey(url, method, body);
    const handler: PromiseHandler = {};
    const fetchPromise = new Promise<Response>((resolve, reject) => {
        handler.resolve = resolve;
        handler.reject = reject;
    });

    if (!hasRequestsInFlight(requestKey)) {
        normalFetch(input, init)
            .then(res => resolveRequestHandlers(res, requestKey))
            .catch(err => rejecteRequestHandlers(err, requestKey))
            .then(() => delete handlers[requestKey]);
    }

    addHandler(handler, requestKey);

    return fetchPromise;
};

export const initDedupe = () => window.fetch = fetchDedupe;

export const removeDedupe = () => window.fetch = normalFetch;
