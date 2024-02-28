import React, { useEffect } from 'react';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { useModiaContext } from '../store/modia-context-store';
import { Env, getEnv } from '../util/utils';
import { SpaName, SpaProps } from '../component/spa';

const AktivitetsplanPage = () => {
  const { aktivBrukerFnr } = useModiaContext();

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

  const Aktivitetsplan: React.ComponentType<SpaProps> = props => {
    useEffect(() => {
      loadAssets({
        appName: SpaName.AKTIVITETSPLAN,
        appBaseUrl: aktivitetsplanCdnUrl,
        assetManifestParser: aktivitetsplanManifestParser
      });
    }, []);
    return React.createElement('dab-aktivitetsplan', { ['data-fnr']: props.fnr });
  };

  return <Aktivitetsplan fnr={aktivBrukerFnr} />;
};

export default AktivitetsplanPage;
