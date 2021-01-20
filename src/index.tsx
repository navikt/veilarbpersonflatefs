import React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './app';
import NavFrontendModal from 'nav-frontend-modal';
import './index.less';

if (!window['_babelPolyfill']) {
	// @ts-ignore
	require('babel-polyfill');
}

NavFrontendModal.setAppElement(document.getElementById('modal-a11y-wrapper'));

if (process.env.REACT_APP_MOCK === 'true') {
	// @ts-ignore
	require('./mock/setup');
}

ReactDOM.render(<App />, document.getElementById('veilarbpersonflatefs-root'));
