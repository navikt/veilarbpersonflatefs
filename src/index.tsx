import React from 'react';
import * as ReactDOM from 'react-dom';
import { settPersonIURL } from './utils/url-utils';
import getWindow from './utils/window';
import App from './app';
import { isAppMocked } from './utils/mock-utils';
import AppMock from './app-mock';
import NavFrontendModal from 'nav-frontend-modal';
import { initialiserToppmeny } from './utils/dekorator-utils';
import './index.less';
import NAVSPA from './utils/navspa';
import { SpaName } from './components/spa';
import { SpaMockContent } from './components/spa-mock/spa-mock';

const window = getWindow();

if (!window._babelPolyfill) {
	// @ts-ignore
	require('babel-polyfill');
}

document.addEventListener('dekorator-hode-personsok', (event: any) => {
	settPersonIURL(event.fodselsnummer);
	initialiserToppmeny();
});

NavFrontendModal.setAppElement(document.querySelector('#modal-a11y-wrapper'));

let app;

if (isAppMocked()) {
	app = <AppMock />;

	NAVSPA.eksporter(SpaName.VEILARBMAOFS, SpaMockContent);
	NAVSPA.eksporter(SpaName.AKTIVITETSPLAN, SpaMockContent);
	NAVSPA.eksporter(SpaName.DIALOG, SpaMockContent);
	NAVSPA.eksporter(SpaName.VEILARBVEDTAKSSTOTTEFS, SpaMockContent);
	NAVSPA.eksporter(SpaName.VEILARBVISITTKORTFS, SpaMockContent);

	// Sett farge på dekoratøren slik at den blir synlig når man kjører lokalt
	document.getElementById('header')!.style.backgroundColor = 'black';

	// @ts-ignore
	require('./mock');
} else {
	app = <App />;
}

ReactDOM.render(app, document.getElementById('veilarbpersonflatefs-app'));
