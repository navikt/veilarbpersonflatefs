import { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { TabId } from '../component/side-innhold';

const TiltakPage = () => {
  const { setCurrentTabId } = useAppContext();

  useEffect(() => {
    setCurrentTabId(TabId.ARBEIDSMARKEDSTILTAK);
  }, [setCurrentTabId]);


  return (
      <div>Deltaker Page</div>
  );
};

export default TiltakPage;
