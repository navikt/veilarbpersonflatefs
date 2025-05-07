import React from 'react';
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

	const { manifest, error } = useSubApp(arbeidsmarkedstiltakBaseUrl);

	if (error) {
		return <div>Klarte ikke laste Arbeidsmarkedstiltak</div>;
	}

	return React.createElement('mulighetsrommet-arbeidsmarkedstiltak', {
		'data-fnr': aktivBrukerFnr,
		'data-enhet': aktivEnhetId,
		'data-manifest': manifest ? JSON.stringify(manifest) : undefined
	});
};

export default ArbeidsmarkedstiltakPage;
