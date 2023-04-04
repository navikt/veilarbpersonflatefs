import { useEffect, useState } from 'react';
import StoreProvider from './store/store-provider';
import { hentFnrFraUrl } from './util/url-utils';
import { PersonflatePage } from './page/personflate';
import { synkroniserManuellStatusMedDkif } from './api/api';
import './sentry';

export const App = () => {
	const [fnr, setFnr] = useState(hentFnrFraUrl() || '');

	useEffect(() => {
		const rerenderIfChangedFnr = (event: any) => {
			const nextFnr = hentFnrFraUrl();
			if (fnr === nextFnr || !nextFnr) return;
			setFnr(nextFnr);
		};
		window.addEventListener('popstate', rerenderIfChangedFnr);
		return () => window.removeEventListener('popstate', rerenderIfChangedFnr);
	}, []);

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
