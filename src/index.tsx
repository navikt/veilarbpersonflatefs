import '@navikt/ds-css';

import './index.less';

import { AsyncNavspa } from '@navikt/navspa';
import { vedtaksstotteAsyncConfig } from './component/spa';
import { erMock } from './util/utils';
import { createRoot } from 'react-dom/client';
import { initAnalytics } from './analytics/analytics';
import App from './App';

const lastInnSubApper = () => {
	AsyncNavspa.preload(vedtaksstotteAsyncConfig);
};
const renderApp = () => {
	const root = createRoot(document.getElementById('veilarbpersonflatefs-root')!!);
	root.render(<App />);
};

if (!globalThis['__core-js_shared__']) {
	// @ts-ignore
	import('core-js/stable');
	// @ts-ignore
	import('regenerator-runtime/runtime');
}

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
	initAnalytics();
	renderApp();
	lastInnSubApper();
}
