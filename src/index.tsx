import React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import NavFrontendModal from 'nav-frontend-modal';
import './index.less';
import { AsyncNavspa } from '@navikt/navspa';
import {
	// arbeidsmarkedstiltakAsyncConfig,
	detaljerAsyncConfig,
	dialogAsyncConfig,
	vedtaksstotteAsyncConfig,
	visittkortAsyncConfig
} from './component/spa';
import { erMock } from './util/utils';

if (!window['_babelPolyfill']) {
	// @ts-ignore
	require('babel-polyfill');
}

NavFrontendModal.setAppElement(document.getElementById('modal-a11y-wrapper'));

if (erMock()) {
	// @ts-ignore
	require('./mock/setup');
}

AsyncNavspa.preload(visittkortAsyncConfig);
AsyncNavspa.preload(detaljerAsyncConfig);
AsyncNavspa.preload(vedtaksstotteAsyncConfig);
AsyncNavspa.preload(dialogAsyncConfig);
// AsyncNavspa.preload(arbeidsmarkedstiltakAsyncConfig);

ReactDOM.render(<App />, document.getElementById('veilarbpersonflatefs-root'));
