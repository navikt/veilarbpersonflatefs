import { utledCDNSpaUrl } from '../util/url-utils';
import { SpaProps } from './spa';
import { SpaName } from '../util/utils';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'ao-visittkort': React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement> & {
					fnr?: string;
					enhet?: string;
					tilbakeTilFlate?: string;
					visVeilederVerktoy?: string;
					skjulEtiketter?: string;
					avsluttOppfolgingOpptelt?: string;
				},
				HTMLElement
			>;
		}
	}
}

/*
const loadScript = (url: string) => {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = url;
		script.async = true;

		script.onload = () => resolve(script);
		script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

		document.head.appendChild(script);
	});
};*/

const visittkortBaseUrl = utledCDNSpaUrl('poao', SpaName.VEILARBVISITTKORTFS);
const lastInnVisittkort = () => {
	fetch(`${visittkortBaseUrl}/asset-manifest.json`)
		.then(it => it.json() as Promise<{ 'index.html': { file: string } }>)
		.then(manifest => {
			const visittkortScriptUrl = `${visittkortBaseUrl}/${manifest['index.html'].file}`;
			return import(visittkortScriptUrl);
		})
		.catch(err => {
			// tslint:disable-next-line:no-console
			console.error(`Failed to load visittkort js, ${err}`, err);
		});
};

lastInnVisittkort();

interface VisittKortProps extends SpaProps {
	tilbakeTilFlate: string;
	visVeilederVerktoy: 'true' | 'false'; // Når man sendre props til custom elements / web comonents så må det være string
}

export const Visittkort: React.ComponentType<VisittKortProps> = ({
	enhet,
	fnr,
	tilbakeTilFlate,
	visVeilederVerktoy
}) => {
	return (
		<ao-visittkort
			enhet={enhet ?? '1234'}
			fnr={fnr ?? '123123123'}
			tilbakeTilFlate={tilbakeTilFlate}
			visVeilederVerktoy={visVeilederVerktoy ? 'true' : 'false'}
			key={fnr}
		></ao-visittkort>
	);
};
