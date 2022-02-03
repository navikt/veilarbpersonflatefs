import React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import NavFrontendModal from 'nav-frontend-modal';
import './index.less';
import { AsyncNavspa } from '@navikt/navspa';
import { detaljerAsyncConfig, vedtaksstotteAsyncConfig, visittkortAsyncConfig } from './component/spa';

if (!window['_babelPolyfill']) {
	// @ts-ignore
	require('babel-polyfill');
}

NavFrontendModal.setAppElement(document.getElementById('modal-a11y-wrapper'));

if (process.env.REACT_APP_MOCK === 'true') {
	// @ts-ignore
	require('./mock/setup');
}

AsyncNavspa.preload(visittkortAsyncConfig);
AsyncNavspa.preload(detaljerAsyncConfig);
AsyncNavspa.preload(vedtaksstotteAsyncConfig);

ReactDOM.render(<App />, document.getElementById('veilarbpersonflatefs-root'));
