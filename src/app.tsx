import React, { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import StoreProvider from './store/store-provider';
import { hentFnrFraUrl } from './util/url-utils';
import { PersonflatePage } from './page/personflate';
import { synkroniserManuellStatusMedDkif } from './api/api';

if (!process.env.REACT_APP_MOCK && process.env.REACT_APP_NOT_SENTRY_ENV) {
	Sentry.init({
		dsn: "https://82639012ef3d42aab4a8ac2d60e2c464@sentry.gc.nav.no/143",
		integrations: [new BrowserTracing()],
		environment: process.env.REACT_APP_SENTRY_ENV,
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});
}

export const App = () => {
	const fnr = hentFnrFraUrl() || '';

	useEffect(() => {
		/*
			Siden det ikke er mulig å få endringer på kontaktinfo fra DKIF asynkront, så må vi gjøre regelmessige spørringer for å holde dataen i synk.
			Tidligere så ble dette gjort som en sideeffekt på et urelatert endepunkt, men det har nå blitt flyttet ut til et eget endepunkt.
			Vi må derfor kalle dette endepunktet hver gang en veileder går inn på en bruker i veilarbpersonflatefs.
			Det trengs ikke å vente på svar fra synkroniseringen før vi går videre med rendring av personflate.
		 */
		if (fnr) {
			synkroniserManuellStatusMedDkif(fnr).catch();
		}
	}, [fnr]);

	return (
		<StoreProvider fnr={fnr}>
			<PersonflatePage />
		</StoreProvider>
	);
};
