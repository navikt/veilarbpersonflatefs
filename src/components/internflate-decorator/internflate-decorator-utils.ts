import { settPersonIURL } from '../../utils/url-utils';

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

	onEnhetChange?: (enhet: string) => void;
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
		toggles: {
			visEnhet: true,
			visEnhetVelger: false,
			visSokefelt: true,
			visVeilder: true
		},
		onSok(fnr: string | null): void {
			console.log('onSok', fnr); // tslint:disable-line
			if (fnr === brukerFnr) {
				return;
			}
			if (fnr && fnr.length > 0) {
				settPersonIURL(fnr);
			} else {
				// fjernBrukerFraPath(history);
			}
		},
		contextholder: true,
		// autoSubmitOnMount: true
	};
}