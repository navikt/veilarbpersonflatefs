import { setupWorker } from 'msw/browser';
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

// window.history.replaceState('', '', '/veilarbpersonflatefs/' + testBrukerFnr + window.location.hash);

export const worker = setupWorker(...handlers)

eksporterSpaMock(internflateDecoratorSpaMockProps);
eksporterSpaMock(visittkortSpaMockProps);

eksporterSpaMock(aktivitetsplanSpaMockProps);
eksporterSpaMock(dialogSpaMockProps);
eksporterSpaMock(detaljerSpaMockProps);
eksporterSpaMock(vedtaksstotteSpaMockProps);
eksporterSpaMock(arbeidsmarkedstiltakSpaMockProps);
