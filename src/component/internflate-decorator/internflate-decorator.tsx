import { SpaName } from '../spa';
import { DecoratorConfigV2, DecoratorEnvironment } from './internflate-decorator-config';
import NAVSPA from '@navikt/navspa';
import { EnvType, getEnv } from '../../util/utils';

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

function getDecoratorEnv(): DecoratorEnvironment {
	const env = getEnv();
	if (env.type === EnvType.prod) {
		return 'prod';
	} else {
		return 'q2';
	}
}

function lagDecoratorConfig(props: InternflateDecoratorProps): DecoratorConfigV2 {
	const fnr = props.fnr ?? undefined;
	const enhetId = props.enhetId ?? undefined;
	return {
		fnr,
		enhet: enhetId,
		onEnhetChanged: newEnhet => props.onEnhetChanged(newEnhet ?? null),
		onFnrChanged: newFnr => props.onFnrChanged(newFnr ?? null),
		environment: getDecoratorEnv(),
		fetchActiveUserOnMount: true,
		fetchActiveEnhetOnMount: true,
		urlFormat: getEnv().ingressType === 'ansatt' ? 'ANSATT' : 'NAV_NO'
	};
}
