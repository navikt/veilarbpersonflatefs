import React, { useEffect } from 'react';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { useAppContext } from '../AppContext';
import { useModiaContext } from '../store/modia-context-store';
import { TabId } from '../component/side-innhold';
import { Env, getEnv } from '../util/utils';
import { SpaName } from '../component/spa';

const AktivitetsplanPage = () => {
  const { setCurrentTabId } = useAppContext();
  const { aktivBrukerFnr } = useModiaContext();

  useEffect(() => {
    setCurrentTabId(TabId.AKTIVITETSPLAN);
  }, [setCurrentTabId]);

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

  useEffect(() => {
    loadAssets({
      appName: SpaName.AKTIVITETSPLAN,
      appBaseUrl: aktivitetsplanCdnUrl,
      assetManifestParser: aktivitetsplanManifestParser
    });
  }, []);

  return React.createElement('dab-aktivitetsplan', { ['data-fnr']: aktivBrukerFnr });
};

export default AktivitetsplanPage;
