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
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";

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
	const decorator = document.getElementById('header')!;
	decorator.style.backgroundColor = 'black';
	decorator.style.height = '65px';

	// @ts-ignore
	require('./mock');
} else {
	app = <App />;
}

// TODO: Remove me!!!
app = <div style={{paddingTop: "10px", margin: "0 auto", width: "400px"}}>
    <AlertStripeAdvarsel>
    Systemet er utilgjengelig mellom 27.des til 02.jan
    </AlertStripeAdvarsel>
</div>

ReactDOM.render(app, document.getElementById('veilarbpersonflatefs-app'));
