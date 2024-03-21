import React, { useEffect } from 'react';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { SpaName } from '../component/spa';
import { Env, getEnv } from '../util/utils';
import { useModiaContext } from '../store/modia-context-store';

const dabCdnUrl = 'https://cdn.nav.no/dab';

const dialogCdnUrl =
    getEnv() === Env.Prod
        ? `${dabCdnUrl}/arbeidsrettet-dialog-prod-intern/build`
        : `${dabCdnUrl}/arbeidsrettet-dialog-dev-intern/build`;

const dialogManifestParser: AssetManifestParser = manifest => {
  const { file } = manifest['index.html'];
  const entry = { type: 'module', path: `${dialogCdnUrl}/${file}` };
  return [entry];
};

const DialogPage = () => {

  const { aktivBrukerFnr } = useModiaContext();

  useEffect(() => {
    loadAssets({
      appName: SpaName.DIALOG,
      appBaseUrl: dialogCdnUrl,
      assetManifestParser: dialogManifestParser
    });
  }, []);

  return React.createElement('dab-dialog', { ['data-fnr']: aktivBrukerFnr });
};

export default DialogPage;
