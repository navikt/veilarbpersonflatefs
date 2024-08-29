import React, { useEffect } from 'react';
import { useModiaContext } from '../store/modia-context-store';
import { erITestMiljo } from '../util/url-utils';
import { importSubApp } from './importUtils';

function utledArbeidsmarkedstiltakCdnUrl(contextPath: string): string {
  const base = 'https://cdn.nav.no/team-mulighetsrommet';
  return erITestMiljo() ? `${base}/dev/${contextPath}` : `${base}/prod/${contextPath}`;
}

const arbeidsmarkedstiltakBaseUrl = utledArbeidsmarkedstiltakCdnUrl('arbeidsmarkedstiltak-modia/dist');

const ArbeidsmarkedstiltakPage = () => {
  const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

	useEffect(() => {
		importSubApp(arbeidsmarkedstiltakBaseUrl);
	}, []);

  return React.createElement('mulighetsrommet-arbeidsmarkedstiltak', {
    'data-fnr': aktivBrukerFnr,
    'data-enhet': aktivEnhetId
  });
};

export default ArbeidsmarkedstiltakPage;
