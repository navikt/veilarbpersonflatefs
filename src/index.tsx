import '@navikt/ds-css';

import { App } from './app';
import './index.less';

import { AsyncNavspa } from '@navikt/navspa';
import {
	aktivitetsplanLoadConfig,
	arbeidsmarkedstiltakAsyncConfig,
	detaljerAsyncConfig,
	dialogLoadConfig,
	vedtaksstotteAsyncConfig,
	visittkortAsyncConfig
} from './component/spa';
import { erMock } from './util/utils';
import { Modal } from '@navikt/ds-react';
import { createRoot } from 'react-dom/client';
import { loadAssets } from '@navikt/navspa/dist/async/async-navspa';

const lastInnSubApper = () => {
	loadAssets(aktivitetsplanLoadConfig);
	AsyncNavspa.preload(visittkortAsyncConfig);
	AsyncNavspa.preload(detaljerAsyncConfig);
	AsyncNavspa.preload(vedtaksstotteAsyncConfig);
	loadAssets(dialogLoadConfig);
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
	renderApp();
	lastInnSubApper();
}
