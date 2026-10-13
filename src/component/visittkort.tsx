import { useEffect, useRef } from 'react';
import { utledCDNSpaUrl } from '../util/url-utils';
import { SpaProps } from './spa';
import { SpaName } from '../util/utils';

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'ao-visittkort': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
				fnr?: string;
				enhet?: string;
				tilbakeTilFlate?: string;
				visVeilederVerktoy?: string;
				skjulEtiketter?: string;
				theme?: 'light' | 'dark';
			};
		}
	}
}

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

type Theme = 'light' | 'dark';

type ThemeChangeEvent = CustomEvent<{
	theme: Theme;

	source: string;
}>;

interface VisittKortProps extends SpaProps {
	tilbakeTilFlate: string;
	visVeilederVerktoy: 'true' | 'false'; // Når man sendre props til custom elements / web comonents så må det være string
	theme?: Theme;
	onThemeChange: (theme: Theme) => void;
}

export const Visittkort: React.ComponentType<VisittKortProps> = ({
	enhet,
	fnr,
	tilbakeTilFlate,
	visVeilederVerktoy,
	theme,
	onThemeChange
}: VisittKortProps) => {
	const elementRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const element = elementRef.current;

		if (!element) {
			return;
		}

		const handleThemeChange = (event: Event) => {
			const customEvent = event as ThemeChangeEvent;

			const nextTheme = customEvent.detail?.theme;

			if (nextTheme === 'light' || nextTheme === 'dark') {
				onThemeChange(nextTheme);
			}
		};

		element.addEventListener('app-theme-change', handleThemeChange);

		return () => {
			element.removeEventListener(
				'app-theme-change',

				handleThemeChange
			);
		};
	}, [onThemeChange]);
	return (
		<ao-visittkort
			ref={elementRef}
			enhet={enhet ?? '1234'}
			fnr={fnr ?? '123123123'}
			tilbakeTilFlate={tilbakeTilFlate}
			visVeilederVerktoy={visVeilederVerktoy}
			theme={theme}
		/>
	);
};
