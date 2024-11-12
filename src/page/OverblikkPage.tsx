import React, { useEffect } from 'react';
import { erITestMiljo } from '../util/url-utils';
import { useModiaContext } from '../store/modia-context-store';
import { importSubApp } from './importUtils';

function utledOverblikkCdnUrl(contextPath: string): string {
  const base = 'https://cdn.nav.no/obo';
  return erITestMiljo() ? `${base}/dev/${contextPath}` : `${base}/prod/${contextPath}`;
}

const overblikkBaseUrl = utledOverblikkCdnUrl('veilarbdetaljerfs/dist');

const OverblikkPage = () => {
  const { aktivBrukerFnr } = useModiaContext();

  useEffect(() => {
    importSubApp(overblikkBaseUrl);
  }, []);

  return React.createElement('veilarb-detaljer', { ['data-fnr']: aktivBrukerFnr });
};

export default OverblikkPage;
