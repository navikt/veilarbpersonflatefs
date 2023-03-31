import { Decorator } from '../spa';
import { DecoratorConfig, EnhetDisplay, FnrDisplay } from './internflate-decorator-config';
import { useEffect } from 'react';

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

function lagDecoratorConfig(props: InternflateDecoratorProps): DecoratorConfig {
	const fnr = props.fnr || null;
	const enhetId = props.enhetId || null;

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
			onChange: props.onFnrChanged
		},
		enhet: {
			display: EnhetDisplay.ENHET,
			value: enhetId,
			skipModal: true,
			ignoreWsEvents: true,
			onChange: props.onEnhetChanged
		},
		useProxy: true
	};
}
