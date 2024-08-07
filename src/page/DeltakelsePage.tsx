import React, { useEffect } from 'react';
import { useModiaContext } from '../store/modia-context-store';
import { erITestMiljo } from '../util/url-utils';
import { importWebComponent } from './importUtils';

function utledArbeidsmarkedstiltakDeltakerCdnUrl(contextPath: string): string {
	const base = 'https://cdn.nav.no/amt';
	return erITestMiljo() ? `${base}/dev/${contextPath}` : '';
}

const arbeidsmarkedsTiltakDeltakerCdnUrl = utledArbeidsmarkedstiltakDeltakerCdnUrl(
	'arbeidsmarkedstiltak-deltaker/build'
);

const DeltakelsePage = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	useEffect(() => {
		importWebComponent(arbeidsmarkedsTiltakDeltakerCdnUrl);
	}, []);

	return React.createElement('arbeidsmarkedstiltak-deltaker', {
		['data-fnr']: aktivBrukerFnr,
		['data-aktivEnhet']: aktivEnhetId
	});
};

export default DeltakelsePage;
