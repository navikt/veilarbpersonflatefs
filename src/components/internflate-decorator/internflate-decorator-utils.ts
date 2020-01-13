import { refreshMedNyEnhetIUrl, refreshMedNyFnrIUrl } from '../../utils/url-utils';

export interface Toggles {
	visVeilder: boolean;
	visSokefelt: boolean;
	visEnhetVelger: boolean;
	visEnhet: boolean;
}
export interface Contextholder {
	url: string;
	promptBeforeEnhetChange?: boolean;
}

export interface DecoratorConfig {
	appname: string;
	fnr: string | undefined | null;
	enhet: string | undefined | null;
	toggles: Toggles;

	onEnhetChange: (enhet: string) => void;
	contextholder?: true | Contextholder;
	autoSubmitOnMount?: boolean;

	onSok(fnr: string): void;
}

export function lagDecoratorConfig(
	brukerFnr: string | undefined | null,
	enhetId: string | undefined | null
): DecoratorConfig {
	return {
		appname: 'Arbeidsrettet oppfølging',
		fnr: brukerFnr,
		enhet: enhetId,
		contextholder: true,
		toggles: {
			visEnhet: true,
			visEnhetVelger: false,
			visSokefelt: true,
			visVeilder: true
		},
		onEnhetChange(enhet: string): void {
			if (enhet !== enhetId) {
				//  TODO: Når apper går over til å kun bruke enhet fra props og ikke henter fra URL
				//   så burde vi ikke laste inn siden på nytt og istedenfor endre på propsene som blir sendt videre ned
				refreshMedNyEnhetIUrl(enhet);
			}
		},
		onSok(fnr: string | null): void {
			if (fnr && fnr.length > 0 && fnr !== brukerFnr) {
				//  TODO: Når apper går over til å kun bruke fnr fra props og ikke henter fra URL
				//   så burde vi ikke laste inn siden på nytt og istedenfor endre på propsene som blir sendt videre ned
				refreshMedNyFnrIUrl(fnr);
			}
		}
	};
}