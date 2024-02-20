import { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { TabId } from '../component/side-innhold';

const FinnStillingerPage = () => {

  const { setCurrentTabId } = useAppContext();

  useEffect(() => {
    setCurrentTabId(TabId.FINN_STILLING_INNGANG);
  }, [setCurrentTabId]);

  return (
      <div>Finn Stillinger Page</div>
  );
};

export default FinnStillingerPage;
