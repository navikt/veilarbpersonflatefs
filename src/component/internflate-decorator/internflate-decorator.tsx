import { SpaName } from '../spa';
import { DecoratorConfigV2 } from './internflate-decorator-config';
import NAVSPA from '@navikt/navspa';
import { getEnv } from '../../util/utils';

interface InternflateDecoratorProps {
	enhetId: string | undefined | null;
	fnr: string | undefined | null;
	onEnhetChanged: (newEnhet: string | null) => void;
	onFnrChanged: (newFnr: string | null) => void;
}

export const Decorator: React.ComponentType<DecoratorConfigV2> = NAVSPA.importer(
	SpaName.INTERNARBEIDSFLATEFS_DECORATOR,
	{
		wrapperClassName: ''
	}
);

export function InternflateDecorator(props: InternflateDecoratorProps) {
	return (
		<nav>
			<Decorator {...lagDecoratorConfig(props)} />
		</nav>
	);
}

function lagDecoratorConfig(props: InternflateDecoratorProps): DecoratorConfigV2 & { proxy: string } {
	const fnr = props.fnr || undefined;
	const enhetId = props.enhetId || undefined;

	return {
		// appname: 'Arbeidsrettet oppfølging',
		// toggles: {
		// 	visVeileder: true
		// },
		fnr,
		enhet: enhetId,
		onEnhetChanged: newEnhet => props.onEnhetChanged(newEnhet || null),
		onFnrChanged: newFnr => props.onFnrChanged(newFnr || null),
		proxy: '/modiacontextholder',
		environment: getEnv() === 'prod' ? 'prod' : 'q1',
		fetchActiveUserOnMount: true,
		fetchActiveEnhetOnMount: true
		/*
		fnr: {
			display: FnrDisplay.SOKEFELT,
			value: fnr,
			skipModal: false,
			ignoreWsEvents: false,
			onChange: props.onFnrChanged
		},
		enhet: {
			display: EnhetDisplay.ENHET,
			value: enhetId,
			skipModal: true,
			ignoreWsEvents: true,
			onChange: props.onEnhetChanged
		},
		useProxy: true*/
	};
}
