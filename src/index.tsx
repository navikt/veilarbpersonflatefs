import '@navikt/ds-css';

import { App } from './app';
import './index.less';

import { AsyncNavspa } from '@navikt/navspa';
import { detaljerAsyncConfig, vedtaksstotteAsyncConfig, visittkortAsyncConfig } from './component/spa';
import { erMock } from './util/utils';
import { Modal } from '@navikt/ds-react';
import { createRoot } from 'react-dom/client';
import { initAmplitude } from './amplitude/amplitude';

const lastInnSubApper = () => {
	AsyncNavspa.preload(visittkortAsyncConfig);
	AsyncNavspa.preload(vedtaksstotteAsyncConfig);
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
	const { worker } = await import('./mock/setup');
	worker
		.start({ serviceWorker: { url: '' + '/mockServiceWorker.js' } })
		.catch((e: Error) => {
			// tslint:disable-next-line:no-console
			console.error('Unable to setup mocked API endpoints', e);
		})
		.then(renderApp);
} else {
	initAmplitude();
	renderApp();
	lastInnSubApper();
}
