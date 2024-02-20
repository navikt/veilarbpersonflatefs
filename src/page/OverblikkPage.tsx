import { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { TabId } from '../component/side-innhold';

const OverblikkPage = () => {

  const { setCurrentTabId } = useAppContext();

  useEffect(() => {
    setCurrentTabId(TabId.OVERBLIKK);
  }, [setCurrentTabId]);

  return (
      <div>Overblikk Page</div>
  );
};

export default OverblikkPage;
