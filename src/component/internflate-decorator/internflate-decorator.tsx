import { EnvType, getEnv } from '../../util/utils';
import { useContext, useLayoutEffect, useRef } from 'react';
import { DispatchContext } from '../../store/store-provider';

export function InternflateDecorator() {
	const dispatch = useContext(DispatchContext);
	const decoratorRef = useRef<HTMLElement>(null);

	useLayoutEffect(() => {
		const decoratorElement = decoratorRef.current;
		if (!decoratorElement) return;
		const handleFnrChanged = (e: Event) => {
			const fnr = (e as CustomEvent).detail.fnr;
			dispatch({ type: 'ON_AKTIV_BRUKER_CHANGED', fnr });
		};
		const handleEnhetChanged = (e: Event) => {
			const enhet = (e as CustomEvent).detail.enhet;
			dispatch({ type: 'ON_AKTIV_ENHET_CHANGED', enhet });
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
			show-enheter="true"
			show-search-area="true"
			fetch-active-enhet-on-mount="true"
			fetch-active-user-on-mount="true"
			show-hotkeys="false"
			proxy={'/api/modiacontextholder'}
		/>
	);
}
