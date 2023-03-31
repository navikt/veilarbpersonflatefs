import React, { useState } from 'react';
import { ModiaContext } from './modia-context-store';

interface StoreProviderProps {
	fnr: string;
	children: React.ReactNode;
}

const StoreProvider = (props: StoreProviderProps) => {
	const [fnr, setFnr] = useState(props.fnr);
	const [aktivEnhet, setAktivEnhet] = useState<null | string>(null);
	return (
		<ModiaContext.Provider
			value={{
				aktivBrukerFnr: fnr,
				setAktivBrukerFnr: setFnr,
				aktivEnhetId: aktivEnhet,
				setAktivEnhetId: setAktivEnhet
			}}
		>
			{props.children}
		</ModiaContext.Provider>
	);
};

export default StoreProvider;
