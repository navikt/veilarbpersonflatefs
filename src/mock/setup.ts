import { setupWorker } from 'msw';
import { handlers } from './api/handlers';
import {
	aktivitetsplanSpaMockProps,
	arbeidsmarkedstiltakSpaMockProps,
	detaljerSpaMockProps,
	dialogSpaMockProps,
	eksporterSpaMock,
	internflateDecoratorSpaMockProps,
	vedtaksstotteSpaMockProps,
	visittkortSpaMockProps
} from './util/spa-mock-utils';
import { testBrukerFnr } from './api/data';

window.history.replaceState('', '', '/veilarbpersonflatefs/' + testBrukerFnr + window.location.hash);

setupWorker(...handlers)
	.start({ serviceWorker: { url: '' + '/mockServiceWorker.js' } })
	.catch(e => {
		// tslint:disable-next-line:no-console
		console.error('Unable to setup mocked API endpoints', e);
	});

eksporterSpaMock(internflateDecoratorSpaMockProps);
eksporterSpaMock(visittkortSpaMockProps);

eksporterSpaMock(aktivitetsplanSpaMockProps);
eksporterSpaMock(dialogSpaMockProps);
eksporterSpaMock(detaljerSpaMockProps);
eksporterSpaMock(vedtaksstotteSpaMockProps);
eksporterSpaMock(arbeidsmarkedstiltakSpaMockProps);
