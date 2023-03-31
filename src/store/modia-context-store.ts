import React, { useContext } from 'react';

interface ModiaContextData {
	aktivBrukerFnr: string;
	setAktivBrukerFnr: (fnr: string) => void;
	aktivEnhetId: string | null;
	setAktivEnhetId: (enhetId: string) => void;
}
export const ModiaContext = React.createContext<ModiaContextData>({
	aktivBrukerFnr: '',
	aktivEnhetId: null,
	// tslint:disable-next-line:no-empty
	setAktivBrukerFnr: () => {},
	// tslint:disable-next-line:no-empty
	setAktivEnhetId: () => {}
});
export const useModiaContext = () => useContext(ModiaContext);
