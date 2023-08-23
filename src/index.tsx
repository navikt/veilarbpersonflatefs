import '@navikt/ds-css';

import { App } from './app';
import './index.less';

import { AsyncNavspa } from '@navikt/navspa';
import {
	arbeidsmarkedstiltakAsyncConfig,
	detaljerAsyncConfig,
	vedtaksstotteAsyncConfig,
	visittkortAsyncConfig
} from './component/spa';
import { erMock } from './util/utils';
import { Modal } from '@navikt/ds-react';
import { createRoot } from 'react-dom/client';
import { initAmplitude } from './amplitude/amplitude';

const lastInnSubApper = () => {
	AsyncNavspa.preload(visittkortAsyncConfig);
	AsyncNavspa.preload(detaljerAsyncConfig);
	AsyncNavspa.preload(vedtaksstotteAsyncConfig);
	AsyncNavspa.preload(arbeidsmarkedstiltakAsyncConfig);
};
const renderApp = () => {
	const root = createRoot(document.getElementById('veilarbpersonflatefs-root')!!);
	root.render(<App />);
};

if (!globalThis['__core-js_shared__']) {
	// @ts-ignore
	import('core-js/stable');
	import('regenerator-runtime/runtime');
}

Modal.setAppElement(document.getElementById('modal-a11y-wrapper'));

if (erMock()) {
	// @ts-ignore
	import('./mock/setup').then(renderApp);
} else {
	initAmplitude();
	renderApp();
	lastInnSubApper();
}
