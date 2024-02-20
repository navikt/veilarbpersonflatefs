import { useEffect } from 'react';
import { AsyncNavspa, AsyncSpaConfig } from '@navikt/navspa';
import { useAppContext } from '../AppContext';
import { useModiaContext } from '../store/modia-context-store';
import { TabId } from '../component/side-innhold';
import { SpaName, SpaProps } from '../component/spa';
import { utledSpaUrl } from '../util/url-utils';
import Spinner from '../component/spinner/spinner';

const OppfolgingsvedtakPage = () => {

  const { setCurrentTabId } = useAppContext();
  const { aktivBrukerFnr, aktivEnhetId } = useModiaContext()

  useEffect(() => {
    setCurrentTabId(TabId.VEDTAKSSTOTTE);
  }, [setCurrentTabId]);


  const vedtaksstotteAsyncConfig: AsyncSpaConfig = {
    appName: SpaName.VEILARBVEDTAKSSTOTTEFS,
    appBaseUrl: utledSpaUrl(SpaName.VEILARBVEDTAKSSTOTTEFS),
    loader: <Spinner />,
    config: {
      wrapperClassName: 'h-screen'
    }
  };

  const Vedtaksstotte: React.ComponentType<SpaProps> = AsyncNavspa.importer<SpaProps>(vedtaksstotteAsyncConfig);

  return (
      <Vedtaksstotte fnr={aktivBrukerFnr} enhet={aktivEnhetId ?? undefined} />
  );
};

export default OppfolgingsvedtakPage;
