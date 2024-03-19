import { createContext, useContext, useMemo, useState } from 'react';
import { AppId } from './data/tab-id';
import { appFromPath } from './Router';

export interface AppContextProps {
  currentAppId: AppId,
  setCurrentAppId: React.Dispatch<React.SetStateAction<AppId>>
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAppId, setCurrentAppId] = useState<AppId>(appFromPath(window.location.pathname).id);

  const contextValue: AppContextProps = useMemo(() => {
    return {
      currentAppId,
      setCurrentAppId
    };
  }, [currentAppId]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export { AppContext, useAppContext, AppContextProvider };
