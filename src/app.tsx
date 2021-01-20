import React from 'react';
import StoreProvider from './store/store-provider';
import { hentFnrFraUrl } from './util/url-utils';
import { PersonflatePage } from './page/personflate';

export const App = () => {
	const fnr = hentFnrFraUrl() || '';

	return (
		<StoreProvider fnr={fnr}>
			<PersonflatePage/>
		</StoreProvider>
	);
};

