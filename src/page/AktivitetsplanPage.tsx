import React, { useEffect } from 'react';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { useModiaContext } from '../store/modia-context-store';
import { Env, getEnv } from '../util/utils';
import { SpaName } from '../component/spa';

const dabCdnUrl = 'https://cdn.nav.no/dab';

const aktivitetsplanCdnUrl =
    getEnv() === Env.Prod
        ? `${dabCdnUrl}/aktivitetsplan-prod-intern/build`
        : `${dabCdnUrl}/aktivitetsplan-dev-intern/build`;

const aktivitetsplanManifestParser: AssetManifestParser = manifest => {
  const { file } = manifest['index.html'];
  const entry = { type: 'module', path: `${aktivitetsplanCdnUrl}/${file}` };
  return [entry];
};

const AktivitetsplanPage = () => {
  const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

  useEffect(() => {
    loadAssets({
      appName: SpaName.AKTIVITETSPLAN,
      appBaseUrl: aktivitetsplanCdnUrl,
      assetManifestParser: aktivitetsplanManifestParser
    });
  }, []);

  return React.createElement('dab-aktivitetsplan', { ['data-fnr']: aktivBrukerFnr, ['data-aktivEnhet']: aktivEnhetId });
};

export default AktivitetsplanPage;
