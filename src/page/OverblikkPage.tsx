import React, { useEffect, useRef } from 'react';
import { utledOboCdnUrl } from '../util/url-utils';
import { useModiaContext } from '../store/modia-context-store';
import { importSubApp } from './importUtils';

const overblikkBaseUrl = utledOboCdnUrl('veilarbdetaljerfs/dist');

const OverblikkPage = () => {
	const { aktivBrukerFnr } = useModiaContext();
	const overblikkElementRef = useRef<HTMLElement>(null);

	useEffect(() => {
		importSubApp(overblikkBaseUrl);
	}, []);

	useEffect(() => {
		const overblikkElement = overblikkElementRef.current;

		if (!overblikkElement) {
			return;
		}

		const syncTheme = () => {
			const theme = document.body.classList.contains('dark') ? 'dark' : 'light';

			if (overblikkElement.getAttribute('theme') !== theme) {
				overblikkElement.setAttribute('theme', theme);
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

	return React.createElement('veilarb-detaljer', {
		ref: overblikkElementRef,
		['data-fnr']: aktivBrukerFnr
	});
};

export default OverblikkPage;
