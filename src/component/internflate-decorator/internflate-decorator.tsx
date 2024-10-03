import { SpaName } from '../spa';
import { DecoratorConfigV2, DecoratorEnvironment } from './internflate-decorator-config';
import NAVSPA from '@navikt/navspa';
import { EnvType, getEnv } from '../../util/utils';
import { useContext, useMemo } from 'react';
import { DispatchContext } from '../../store/store-provider';

interface InternflateDecoratorProps {
	// enhetId: string | undefined | null;
	// fnr: string | undefined | null;
	onEnhetChanged: (newEnhet: string) => void;
	onFnrChanged: (newFnr: string) => void;
}

export const Decorator: React.ComponentType<DecoratorConfigV2> = NAVSPA.importer(
	SpaName.INTERNARBEIDSFLATEFS_DECORATOR,
	{
		wrapperClassName: ''
	}
);

export function InternflateDecorator() {
	const dispatch = useContext(DispatchContext);
	const decoratorProps = useMemo(() => {
		return lagDecoratorConfig({
			onEnhetChanged: enhet => dispatch({ type: 'ON_AKTIV_ENHET_CHANGED', enhet }),
			onFnrChanged: fnr => dispatch({ type: 'ON_AKTIV_BRUKER_CHANGED', fnr })
		});
	}, []);

	return (
		<nav>
			<Decorator {...lagDecoratorConfig(decoratorProps)} />
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

function lagDecoratorConfig(
	props: InternflateDecoratorProps
): DecoratorConfigV2 & { proxy: string; useProxy: boolean } {
	// const fnr = props.fnr ?? undefined;
	// const enhetId = props.enhetId ?? undefined;
	return {
		fnr: undefined,
		enhet: undefined,
		onEnhetChanged: newEnhet => props.onEnhetChanged(newEnhet ?? null),
		onFnrChanged: newFnr => props.onFnrChanged(newFnr ?? null),
		useProxy: true,
		proxy: '/modiacontextholder',
		environment: getDecoratorEnv(),
		fetchActiveUserOnMount: true,
		fetchActiveEnhetOnMount: true,
		urlFormat: getEnv().ingressType === 'ansatt' ? 'ANSATT' : 'NAV_NO',
		appName: 'Arbeidsrettet oppfølging'
	};
}
