import { EnvType, erMock, getEnv } from './util/utils';
import {
	init,
	httpClientIntegration,
	browserTracingIntegration,
	Event,
	Breadcrumb,
	EventHint,
	ErrorEvent,
	makeMultiplexedTransport,
	makeFetchTransport,
	moduleMetadataIntegration
} from '@sentry/react';

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

const fjernPersonopplysninger = (event: ErrorEvent, hint: EventHint): ErrorEvent => {
	const url = event.request?.url ? maskerPersonopplysninger(event.request.url) : '';
	return {
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
};

const ROUTE_TO_KEY = 'ROUTE_TO';
const transport = makeMultiplexedTransport(makeFetchTransport, args => {
	const event = args.getEvent();
	if (event && event.extra && ROUTE_TO_KEY in event.extra && Array.isArray(event.extra[ROUTE_TO_KEY])) {
		return event.extra[ROUTE_TO_KEY];
	}
	return [];
});

const routeToCorrectSentryProject = (event: ErrorEvent, hint: EventHint): ErrorEvent => {
	if (event?.exception?.values?.[0].stacktrace?.frames) {
		const frames = event.exception.values[0].stacktrace.frames;
		// Find the last frame with module metadata containing a DSN
		const routeTo = frames
			.filter(frame => frame.module_metadata && frame.module_metadata.dsn)
			.map(v => v.module_metadata)
			.slice(-1); // using top frame only - you may want to customize this according to your needs
		if (routeTo.length) {
			event.extra = {
				...event.extra,
				[ROUTE_TO_KEY]: routeTo
			};
		}
	}
	return event;
};

const beforeSend = (event: ErrorEvent, hint: EventHint): ErrorEvent => {
	const eventUtenPersonopplysninger = fjernPersonopplysninger(event, hint);
	return routeToCorrectSentryProject(eventUtenPersonopplysninger, hint);
};

if (getEnv().type !== EnvType.local) {
	init({
		dsn: 'https://82639012ef3d42aab4a8ac2d60e2c464@sentry.gc.nav.no/143',
		integrations: [
			browserTracingIntegration(),
			httpClientIntegration({
				failedRequestTargets: [/https:\/\/veilarbpersonflate\.intern(\.dev)?\.nav.no\/*/]
			}),
			moduleMetadataIntegration()
		],
		environment: getEnv().type,
		enabled: !erMock(),
		transport /* Custom transport for mulitplexing requests based on metadata https://docs.sentry.io/platforms/javascript/best-practices/micro-frontends/ */,
		ignoreErrors: [/^canceled$/, /Amplitude/],
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
		beforeSend
	});
}
