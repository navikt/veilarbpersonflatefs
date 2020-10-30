import React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import { isAppMocked } from './utils/mock-utils';
import AppMock from './app-mock';
import NavFrontendModal from 'nav-frontend-modal';
import NAVSPA from './utils/navspa';
import { SpaName } from './components/spa';
import { SpaMockContent } from './components/spa-mock/spa-mock';
import './index.less';
import { testBrukerFnr } from './mocks/data';

if (!window['_babelPolyfill']) {
	// @ts-ignore
	require('babel-polyfill');
}

NavFrontendModal.setAppElement(document.getElementById('modal-a11y-wrapper'));

let app;

if (isAppMocked()) {
	window.history.replaceState('', '', '/veilarbpersonflatefs/' + testBrukerFnr + window.location.hash);

	app = <AppMock />;

	NAVSPA.eksporter(SpaName.INTERNARBEIDSFLATEFS_DECORATOR, SpaMockContent);
	NAVSPA.eksporter(SpaName.VEILARBMAOFS, SpaMockContent);
	NAVSPA.eksporter(SpaName.AKTIVITETSPLAN, SpaMockContent);
	NAVSPA.eksporter(SpaName.DIALOG, SpaMockContent);
	NAVSPA.eksporter(SpaName.VEILARBVEDTAKSSTOTTEFS, SpaMockContent);
	NAVSPA.eksporter(SpaName.VEILARBVISITTKORTFS, SpaMockContent);

	// @ts-ignore
	require('./mocks/setup-worker');
} else {
	app = <App />;
}

ReactDOM.render(app, document.getElementById('veilarbpersonflatefs-root'));
