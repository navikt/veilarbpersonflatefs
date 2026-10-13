import React, { useEffect, useRef } from 'react';
import { useModiaContext } from '../store/modia-context-store';
import { erITestMiljo } from '../util/url-utils';
import { useSubApp } from './importUtils';

function utledArbeidsmarkedstiltakCdnUrl(contextPath: string): string {
	const base = 'https://cdn.nav.no/team-mulighetsrommet';
	return erITestMiljo() ? `${base}/dev/${contextPath}` : `${base}/prod/${contextPath}`;
}

const arbeidsmarkedstiltakBaseUrl = utledArbeidsmarkedstiltakCdnUrl('arbeidsmarkedstiltak-modia/dist');

const ArbeidsmarkedstiltakPage = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	const arbeidsmarkedstiltakElementRef = useRef<HTMLElement>(null);

	const { manifest, error } = useSubApp(arbeidsmarkedstiltakBaseUrl);

	useEffect(() => {
		const arbeidsmarkedstiltakElement = arbeidsmarkedstiltakElementRef.current;

		if (!arbeidsmarkedstiltakElement) {
			return;
		}

		const syncTheme = () => {
			const theme = document.body.classList.contains('dark') ? 'dark' : 'light';

			if (arbeidsmarkedstiltakElement.getAttribute('aksel-theme') !== theme) {
				arbeidsmarkedstiltakElement.setAttribute('aksel-theme', theme);
			}
		};

		syncTheme();

		const observer = new MutationObserver(syncTheme);
		observer.observe(document.body, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	if (error) {
		return <div>Klarte ikke laste Arbeidsmarkedstiltak</div>;
	}

	return React.createElement('mulighetsrommet-arbeidsmarkedstiltak', {
		ref: arbeidsmarkedstiltakElementRef,
		'data-fnr': aktivBrukerFnr,
		'data-enhet': aktivEnhetId,
		'data-base-url': arbeidsmarkedstiltakBaseUrl,
		'data-asset-manifest': manifest ? JSON.stringify(manifest) : undefined
	});
};

export default ArbeidsmarkedstiltakPage;
