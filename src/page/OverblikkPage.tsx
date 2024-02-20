import React, { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { TabId } from '../component/side-innhold';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { SpaName, SpaProps } from '../component/spa';
import { utledSpaUrl } from '../util/url-utils';
import { useModiaContext } from '../store/modia-context-store';

const OverblikkPage = () => {

  const { setCurrentTabId } = useAppContext();
  const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

  useEffect(() => {
    setCurrentTabId(TabId.OVERBLIKK);
  }, [setCurrentTabId]);

  const veilarbdetaljerBaseUrl = utledSpaUrl(SpaName.VEILARBDETALJER);
  const veilarbdetaljerManifestParser: AssetManifestParser = manifest => {
    const { file } = manifest['index.html'];
    const entry = { type: 'module', path: `${veilarbdetaljerBaseUrl}/${file}` };
    return [entry];
  };

  const DetaljerNy: React.ComponentType<SpaProps> = props => {
    useEffect(() => {
      loadAssets({
        appName: SpaName.VEILARBDETALJER,
        appBaseUrl: veilarbdetaljerBaseUrl,
        assetManifestParser: veilarbdetaljerManifestParser
      });
    }, []);
    return React.createElement('veilarb-detaljer', { ['data-fnr']: props.fnr });
  };

  return (
      <DetaljerNy fnr={aktivBrukerFnr} enhet={aktivEnhetId ?? undefined} />
  );
};

export default OverblikkPage;
