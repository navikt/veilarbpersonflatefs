import { EnvType, getEnv } from '../../util/utils';
import { useModiaContext } from '../../store/modia-context-store';
import { useLayoutEffect } from 'react';

type Environment = 'q2' | 'prod' | 'local' | 'mock';

export function InternflateDecorator() {
	const { aktivBrukerFnr, setAktivBrukerFnr, setAktivEnhetId } = useModiaContext();

	useLayoutEffect(() => {
		const element = document.querySelector('internarbeidsflate-decorator');
		if (!element) return;

		const onEnhetChanged = (event: Event) => {
			const detail = (event as CustomEvent<{ enhet?: string | null }>).detail;
			if (detail.enhet) {
				setAktivEnhetId(detail.enhet);
			}
		};
		const onFnrChanged = (event: Event) => {
			const detail = (event as CustomEvent<{ fnr?: string | null }>).detail;
			if (detail.fnr) {
				setAktivBrukerFnr(detail.fnr);
			}
		};

		element.addEventListener('enhet-changed', onEnhetChanged);
		element.addEventListener('fnr-changed', onFnrChanged);

		return () => {
			element.removeEventListener('enhet-changed', onEnhetChanged);
			element.removeEventListener('fnr-changed', onFnrChanged);
		};
	}, [setAktivBrukerFnr, setAktivEnhetId]);

	return (
		<nav>
			<internarbeidsflate-decorator
				app-name="Arbeidsrettet oppfølging"
				enhet-sync-mode="ignore"
				environment={getDecoratorEnv()}
				fnr={aktivBrukerFnr}
				fnr-sync-mode="writeOnly"
				proxy="/modiacontextholder"
				url-format={getUrlFormat()}
			/>
		</nav>
	);
}

function getDecoratorEnv(): Environment {
	const env = getEnv();
	if (env.type === EnvType.prod) {
		return 'prod';
	} else if (env.type === EnvType.local) {
		return 'local';
	} else {
		return 'q2';
	}
}

function getUrlFormat(): 'LOCAL' | 'NAV_NO' | 'ANSATT' {
	const env = getEnv();
	if (env.type === EnvType.local) {
		return 'LOCAL';
	}
	return env.ingressType === 'ansatt' ? 'ANSATT' : 'NAV_NO';
}
