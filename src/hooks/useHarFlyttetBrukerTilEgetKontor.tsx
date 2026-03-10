import { useState } from 'react';


const useHarFlyttetBrukerTilEgetKontor = (brukerFnr: string) => {
	const sessionStorageKey = `harFlyttetBrukerTilEgetKontor-${brukerFnr}`;
	const [harFlyttetBrukerTilEgetKontor, setHarFlyttetBrukerTilEgetKontor] = useState<boolean>(!(!window.sessionStorage.getItem(sessionStorageKey)));

	const settAtVeilederHarFlyttetBrukerTilEgetKontor = () => {
		setHarFlyttetBrukerTilEgetKontor(true);
		window.sessionStorage.setItem(sessionStorageKey, 'true');
	}

	return { harFlyttetBrukerTilEgetKontor, settAtVeilederHarFlyttetBrukerTilEgetKontor };
}

export default useHarFlyttetBrukerTilEgetKontor;