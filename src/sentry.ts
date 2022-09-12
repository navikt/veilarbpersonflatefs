import { erMock } from './util/utils';
import { Breadcrumb, Event } from '@sentry/types'
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

enum Env {
	Local = 'local',
	Dev = 'dev',
	Prod = 'prod',
}

export const getEnv = (): string => {
	const { hostname } = window.location;
	if (hostname.includes('dev.intern.nav.no')) return Env.Dev;
	if (hostname.includes('intern.nav.no')) return Env.Prod;
	return Env.Local;
};

const fnrRegexRegel = {
	regex: /[0-9]{11}/g,
	erstatning: '<fnr>',
}

const maskerPersonopplysninger = (tekst?: string) => {
	if (!tekst) return undefined;
	return tekst.replace(fnrRegexRegel.regex, fnrRegexRegel.erstatning)
};

const fjernPersonopplysninger = (event: Event): Event => {
	const url = event.request?.url ? maskerPersonopplysninger(event.request.url) : '';
	return {
		...event,
		request: {
			...event.request,
			url,
			headers: {
				Referer: maskerPersonopplysninger(event.request?.headers?.Referer) || '',
			},
		},
		breadcrumbs: (event.breadcrumbs || []).map((breadcrumb: Breadcrumb) => ({
			...breadcrumb,
			message: maskerPersonopplysninger(breadcrumb.message),
			data: {
				...breadcrumb.data,
				url: maskerPersonopplysninger(breadcrumb.data?.url),
				from: maskerPersonopplysninger(breadcrumb.data?.from),
				to: maskerPersonopplysninger(breadcrumb.data?.to),
			},
		})),
	};
};

Sentry.init({
	dsn: 'https://82639012ef3d42aab4a8ac2d60e2c464@sentry.gc.nav.no/143',
	integrations: [new BrowserTracing({
		tracingOrigins: [
			/veilarbvisittkortfs(\.dev)?.intern.nav.no/,
			/veilarbvedtaksstottefs(\.dev)?.intern.nav.no/,
			/arbeidsrettet-dialog(\.dev)?.intern.nav.no/,
			/veilarbpersonflate(\.dev)?.intern.nav.no/,
			// Can't trace these apps, current CORS-config does not allow tracing headers
			// /registrer-tilretteleggingsbehov(\.dev)?.intern.nav.no/
			// /mulighetsrommet-veileder-flate(\.dev)?.intern.nav.no/,
		]
	})],
	environment: getEnv(),
	enabled: !erMock(),
	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 0.2,
	beforeSend: fjernPersonopplysninger
});
