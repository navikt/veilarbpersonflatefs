import React, { useMemo, useState } from 'react';
import { ModiaContext } from './modia-context-store';

interface StoreProviderProps {
	fnr: string;
	children: React.ReactNode;
}

const StoreProvider = (props: StoreProviderProps) => {
	const [fnr, setFnr] = useState(props.fnr);
	const [aktivEnhet, setAktivEnhet] = useState<null | string>(null);

	const memoSetfnr = useMemo(() => setFnr, [setFnr]);
	const memoSetEnhet = useMemo(() => setAktivEnhet, [setAktivEnhet]);

	return (
		<ModiaContext.Provider
			value={{
				aktivBrukerFnr: fnr,
				setAktivBrukerFnr: memoSetfnr,
				aktivEnhetId: aktivEnhet,
				setAktivEnhetId: memoSetEnhet
			}}
		>
			{props.children}
		</ModiaContext.Provider>
	);
};

export default StoreProvider;
