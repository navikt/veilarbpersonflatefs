import { refreshMedNyEnhetIUrl, refreshMedNyFnrIUrl } from '../../utils/url-utils';
import { DecoratorConfig, EnhetDisplay, FnrDisplay } from './internflate-decorator-config';

export function lagDecoratorConfig(
	brukerFnr: string | undefined | null,
	enhetId: string | undefined | null
): DecoratorConfig {
	const fnr = brukerFnr ? brukerFnr : null;
	const enhet = enhetId ? enhetId : null;

	return {
		appname: 'Arbeidsrettet oppfølging',
		toggles: {
			visVeileder: true
		},
		fnr: {
			display: FnrDisplay.SOKEFELT,
			value: fnr,
			skipModal: false,
			ignoreWsEvents: false,
			onChange: (newFnr: string | null) => {
				if (newFnr && newFnr.length > 0 && newFnr !== fnr) {
					//  TODO: Når apper går over til å kun bruke fnr fra props og ikke henter fra URL
					//   så burde vi ikke laste inn siden på nytt og istedenfor endre på propsene som blir sendt videre ned
					refreshMedNyFnrIUrl(newFnr);
				}
			}
		},
		enhet: {
			display: EnhetDisplay.ENHET,
			value: enhet,
			skipModal: true,
			ignoreWsEvents: true,
			onChange: (newEnhet: string | null) => {
				if (newEnhet && newEnhet !== enhet) {
					//  TODO: Når apper går over til å kun bruke enhet fra props og ikke henter fra URL
					//   så burde vi ikke laste inn siden på nytt og istedenfor endre på propsene som blir sendt videre ned
					refreshMedNyEnhetIUrl(newEnhet);
				}
			}
		}
	};
}