import { createContext, useContext, useState } from 'react';
import { TabId } from './data/tab-id';

export interface AppContextProps {
  currentTabId: TabId,
  setCurrentTabId: React.Dispatch<React.SetStateAction<TabId>>
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};

const AppContextProvider = ({ children }: {
  children: React.ReactNode
}) => {
  const [currentTabId, setCurrentTabId] = useState<TabId>(TabId.AKTIVITETSPLAN);

  const contextValue: AppContextProps = {
    currentTabId,
    setCurrentTabId
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export { AppContext, useAppContext, AppContextProvider };
