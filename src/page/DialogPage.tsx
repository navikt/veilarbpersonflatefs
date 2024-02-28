import React, { useEffect } from 'react';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { SpaName, SpaProps } from '../component/spa';
import { Env, getEnv } from '../util/utils';
import { useModiaContext } from '../store/modia-context-store';

const DialogPage = () => {
  const dabCdnUrl = 'https://cdn.nav.no/dab';

  const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

  const dialogCdnUrl =
      getEnv() === Env.Prod
          ? `${dabCdnUrl}/arbeidsrettet-dialog-prod-intern/build`
          : `${dabCdnUrl}/arbeidsrettet-dialog-dev-intern/build`;

  const dialogManifestParser: AssetManifestParser = manifest => {
    const { file } = manifest['index.html'];
    const entry = { type: 'module', path: `${dialogCdnUrl}/${file}` };
    return [entry];
  };

  const Dialog: React.ComponentType<SpaProps> = props => {
    useEffect(() => {
      loadAssets({
        appName: SpaName.DIALOG,
        appBaseUrl: dialogCdnUrl,
        assetManifestParser: dialogManifestParser
      });
    }, []);
    return React.createElement('dab-dialog', { ['data-fnr']: props.fnr });
  };


  return (
      <Dialog fnr={aktivBrukerFnr} enhet={aktivEnhetId ?? undefined} />
  );
};

export default DialogPage;
