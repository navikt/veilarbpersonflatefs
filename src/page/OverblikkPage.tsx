import React, { useEffect } from 'react';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { SpaName } from '../component/spa';
import { utledSpaUrl } from '../util/url-utils';
import { useModiaContext } from '../store/modia-context-store';

const veilarbdetaljerBaseUrl = utledSpaUrl(SpaName.VEILARBDETALJER);
const veilarbdetaljerManifestParser: AssetManifestParser = manifest => {
  const { file } = manifest['index.html'];
  const entry = { type: 'module', path: `${veilarbdetaljerBaseUrl}/${file}` };
  return [entry];
};

const OverblikkPage = () => {
  const { aktivBrukerFnr } = useModiaContext();

  useEffect(() => {
    loadAssets({
      appName: SpaName.VEILARBDETALJER,
      appBaseUrl: veilarbdetaljerBaseUrl,
      assetManifestParser: veilarbdetaljerManifestParser
    });
  }, []);

  return React.createElement('veilarb-detaljer', { ['data-fnr']: aktivBrukerFnr });
};

export default OverblikkPage;
