import { EnvType, erMock, getEnv } from './util/utils';
import {
	init,
	httpClientIntegration,
	browserTracingIntegration,
	Event,
	Breadcrumb,
	EventHint,
	ErrorEvent
} from '@sentry/react';
import { resolveProxyBackendFromUrl } from './util/proxy-backends';

const fnrRegexRegel = {
	regex: /[0-9]{11}/g,
	erstatning: '&lt;fnr&gt;'
};

const maskerPersonopplysninger = (tekst?: string) => {
	if (!tekst) return undefined;
	return tekst.replace(fnrRegexRegel.regex, fnrRegexRegel.erstatning);
};

const toRoute = (route: string) => {
	return route.replace(fnrRegexRegel.regex, '&#58;fnr');
};

const tagsFilter = (tags: Event['tags']): Event['tags'] => {
	if (typeof tags !== 'object' || !('transaction' in tags) || !tags.transaction) return tags;
	return {
		...tags,
		transaction: toRoute(tags?.transaction as unknown as string)
	};
};

const HTTP_STATUS_REGEX = /HTTP Client Error with status code:\s*(\d{3})/;

const extractStatusCode = (event: ErrorEvent): number | undefined => {
	const exceptionValue = event.exception?.values?.[0]?.value;
	if (typeof exceptionValue === 'string') {
		const status = Number(exceptionValue.match(HTTP_STATUS_REGEX)?.[1]);
		if (!Number.isNaN(status)) return status;
	}

	const requestAsRecord = event.request as Record<string, unknown> | undefined;
	const statusCode = requestAsRecord?.status_code;
	if (typeof statusCode === 'number') return statusCode;
	if (typeof statusCode === 'string') {
		const parsed = Number(statusCode);
		if (!Number.isNaN(parsed)) return parsed;
	}

	const responseContext = event.contexts?.response as Record<string, unknown> | undefined;
	const responseStatusCode = responseContext?.status_code;
	if (typeof responseStatusCode === 'number') return responseStatusCode;
	if (typeof responseStatusCode === 'string') {
		const parsed = Number(responseStatusCode);
		if (!Number.isNaN(parsed)) return parsed;
	}

	return undefined;
};

const extractRequestUrl = (event: ErrorEvent): string | undefined => {
	if (event.request?.url) return event.request.url;
	for (const breadcrumb of event.breadcrumbs || []) {
		if (typeof breadcrumb.data?.url === 'string') return breadcrumb.data.url;
	}
	return undefined;
};

const extractRequestMethod = (event: ErrorEvent): string | undefined => {
	if (typeof event.request?.method === 'string') return event.request.method.toUpperCase();
	for (const breadcrumb of event.breadcrumbs || []) {
		if (typeof breadcrumb.data?.method === 'string') return breadcrumb.data.method.toUpperCase();
	}
	return undefined;
};

const getPathFromUrl = (url: string): string => {
	if (url.startsWith('/')) return url;
	try {
		return new URL(url).pathname;
	} catch {
		return url;
	}
};

const rewriteHttpErrorEvent = (event: ErrorEvent): ErrorEvent => {
	const statusCode = extractStatusCode(event);
	if (!statusCode || statusCode < 400) return event;

	const url = extractRequestUrl(event);
	const method = extractRequestMethod(event);
	const path = url ? getPathFromUrl(url) : undefined;
	const backend = url ? resolveProxyBackendFromUrl(url) : undefined;
	const titleParts = ['HTTP', String(statusCode)];
	if (method) titleParts.push(method);
	if (path) titleParts.push(path);
	const title = titleParts.join(' ');

	return {
		...event,
		level: statusCode >= 500 ? 'error' : 'warning',
		message: title,
		exception: {
			...event.exception,
			values: (event.exception?.values || []).map((value, idx) => {
				if (idx > 0) return value;
				return {
					...value,
					type: 'HttpError',
					value: title
				};
			})
		},
		tags: {
			...event.tags,
			...(backend ? { backend: backend.toApp.name } : {})
		},
		fingerprint: [
			'http-client',
			String(statusCode),
			backend?.toApp.name || 'unknown-backend',
			backend?.fromPath || path || 'unknown-path'
		]
	};
};

const fjernPersonopplysninger = (event: ErrorEvent, _hint: EventHint): ErrorEvent => {
	const url = event.request?.url ? maskerPersonopplysninger(event.request.url) : '';
	const sanitized = {
		...event,
		request: {
			...event.request,
			url,
			headers: {
				Referer: maskerPersonopplysninger(event.request?.headers?.Referer) || ''
			}
		},
		tags: tagsFilter(event.tags),
		breadcrumbs: (event.breadcrumbs || []).map((breadcrumb: Breadcrumb) => ({
			...breadcrumb,
			message: maskerPersonopplysninger(breadcrumb.message),
			data: {
				...breadcrumb.data,
				url: maskerPersonopplysninger(breadcrumb.data?.url),
				from: maskerPersonopplysninger(breadcrumb.data?.from),
				to: maskerPersonopplysninger(breadcrumb.data?.to)
			}
		}))
	};

	return rewriteHttpErrorEvent(sanitized);
};

if (getEnv().type !== EnvType.local) {
	init({
		initialScope: {
			tags: { microfrontend: 'veilarbpersonflate' }
		},
		dsn: 'https://82639012ef3d42aab4a8ac2d60e2c464@sentry.gc.nav.no/143',
		integrations: [
			browserTracingIntegration(),
			httpClientIntegration({
				failedRequestTargets: [/https:\/\/veilarbpersonflate\.intern(\.dev)?\.nav.no\/*/]
			})
		],
		environment: getEnv().type,
		enabled: !erMock(),
		ignoreErrors: [/^canceled$/],
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 0.2,
		tracePropagationTargets: [
			/veilarbvisittkortfs(\.dev)?.intern.nav.no/,
			/veilarbvedtaksstottefs(\.dev)?.intern.nav.no/,
			/arbeidsrettet-dialog(\.dev)?.intern.nav.no/,
			/veilarbpersonflate(\.dev)?.intern.nav.no/
			// Can't trace these apps, current CORS-config does not allow tracing headers
			// /mulighetsrommet-veileder-flate(\.dev)?.intern.nav.no/,
		],
		profilesSampleRate: 1.0,
		beforeSend: fjernPersonopplysninger
	});
}
