import { Decorator } from '../spa';
import { DecoratorConfig, DecoratorConfigV2, EnhetDisplay, FnrDisplay } from './internflate-decorator-config';

interface InternflateDecoratorProps {
	enhetId: string | undefined | null;
	fnr: string | undefined | null;
	onEnhetChanged: (newEnhet: string | null) => void;
	onFnrChanged: (newFnr: string | null) => void;
}

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
		proxy: '/modiacontextholder'
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
