import { setupWorker } from 'msw';
import { handlers } from './api/handlers';
import {
	aktivitetsplanSpaMockProps, detaljerSpaMockProps,
	dialogSpaMockProps, eksporterSpaMock, internflateDecoratorSpaMockProps,
	vedtaksstotteSpaMockProps, visittkortSpaMockProps
} from './util/spa-mock-utils';
import { testBrukerFnr } from './api/data';

window.history.replaceState('', '', '/veilarbpersonflatefs/' + testBrukerFnr + window.location.hash);

setupWorker(...handlers)
	.start({ serviceWorker: { url: process.env.PUBLIC_URL + '/mockServiceWorker.js' } })
	.then(() => {
		// tslint:disable-next-line:no-console
		console.log('Running with mocked API endpoints');
	})
	.catch((e) => {
		// tslint:disable-next-line:no-console
		console.error('Unable to setup mocked API endpoints', e)
	});

eksporterSpaMock(internflateDecoratorSpaMockProps);
eksporterSpaMock(visittkortSpaMockProps);

eksporterSpaMock(aktivitetsplanSpaMockProps);
eksporterSpaMock(dialogSpaMockProps);
eksporterSpaMock(detaljerSpaMockProps);
eksporterSpaMock(vedtaksstotteSpaMockProps);
