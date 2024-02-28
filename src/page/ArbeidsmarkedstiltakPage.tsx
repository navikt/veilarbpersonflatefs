import React, { useEffect } from 'react';
import { AssetManifestParser, loadAssets } from '@navikt/navspa/dist/async/async-navspa';
import { SpaName, SpaProps } from '../component/spa';
import { utledCdnUrl } from '../util/url-utils';
import { useModiaContext } from '../store/modia-context-store';

const arbeidsmarkedstiltakBaseUrl = utledCdnUrl('mulighetsrommet/arbeidsmarkedstiltak-modia/dist');

const arbeidsmarkedstiltakManifestParser: AssetManifestParser = manifest => {
  const { file } = manifest['index.html'];
  const entry = { type: 'module', path: `${arbeidsmarkedstiltakBaseUrl}/${file}` };
  return [entry];
};

const Arbeidsmarkedstiltak: React.ComponentType<SpaProps> = props => {
  useEffect(() => {
    loadAssets({
      appName: SpaName.ARBEIDSMARKEDSTILTAK,
      appBaseUrl: arbeidsmarkedstiltakBaseUrl,
      assetManifestParser: arbeidsmarkedstiltakManifestParser
    });
  }, []);
  return React.createElement('mulighetsrommet-arbeidsmarkedstiltak', {
    'data-fnr': props.fnr,
    'data-enhet': props.enhet
  });
};

/*TODO Props for fnr og*/
const ArbeidsmarkedstiltakPage = () => {

  const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();

  return (
      <Arbeidsmarkedstiltak fnr={aktivBrukerFnr} enhet={aktivEnhetId ?? undefined} />
  );
};

export default ArbeidsmarkedstiltakPage;
