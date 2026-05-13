import { DecoratorConfigV2, DecoratorEnvironment } from './internflate-decorator-config';
import { EnvType, getEnv } from '../../util/utils';
import { useContext, useLayoutEffect, useMemo, useRef } from 'react';
import { DispatchContext } from '../../store/store-provider';

interface InternflateDecoratorProps {
	onEnhetChanged: (newEnhet: string | undefined | null) => void;
	onFnrChanged: (newFnr: string | undefined | null) => void;
}

export function InternflateDecorator() {
	const dispatch = useContext(DispatchContext);
	const decoratorProps = useMemo(() => {
		return lagDecoratorConfig({
			onEnhetChanged: enhet => dispatch({ type: 'ON_AKTIV_ENHET_CHANGED', enhet }),
			onFnrChanged: fnr => dispatch({ type: 'ON_AKTIV_BRUKER_CHANGED', fnr })
		});
	}, []);

	const decoratorRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const decoratorElement = decoratorRef.current;
		if (!decoratorElement) return;
		const handleFnrChanged = (e: Event) => {
			const fnr = (e as CustomEvent).detail.fnr;
			decoratorProps.onFnrChanged(fnr);
		};
		const handleEnhetChanged = (e: Event) => {
			const enhet = (e as CustomEvent).detail.enhet;
			decoratorProps.onEnhetChanged(enhet);
		}
		decoratorElement.addEventListener('fnr-changed', handleFnrChanged);
		decoratorElement.addEventListener('enhet-changed', handleEnhetChanged);
		return () => {
			decoratorElement.removeEventListener('fnr-changed', handleFnrChanged);
			decoratorElement.removeEventListener('enhet-changed', handleFnrChanged);
		};
	}, []);

	return (
		<internarbeidsflate-decorator
			ref={decoratorRef}
			app-name="Arbeidsrettet oppfølging"
			environment={getEnv().type === EnvType.prod ? 'prod' : 'q2'}
			url-format={getEnv().ingressType === 'ansatt' ? 'ANSATT' : 'NAV_NO'}
			show-enheter="false"
			show-search-area="true"
			fetch-active-enhet-on-mount="false"
			fetch-active-user-on-mount="true"
			show-hotkeys="false"
			proxy={'/api/modiacontextholder'}
		/>
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
