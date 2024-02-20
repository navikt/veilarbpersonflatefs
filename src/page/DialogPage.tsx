import { useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { TabId } from '../component/side-innhold';

const DialogPage = () => {

  const { setCurrentTabId } = useAppContext();

  useEffect(() => {
    setCurrentTabId(TabId.DIALOG);
  }, [setCurrentTabId]);

  return (
      <div>Dialog Page</div>
  );
};

export default DialogPage;
