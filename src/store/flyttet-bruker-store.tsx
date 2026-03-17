import { useState } from 'react';


const useHarFlyttetBrukerTilEgetKontor = (brukerFnr: string) => {
	const keyPrefix = 'harFlyttetBrukerTilEgetKontor';
	const flyttetBrukerTilEgetKontorKey = `${keyPrefix}-${brukerFnr}`;
	const [harFlyttetBrukerTilEgetKontor, setHarFlyttetBrukerTilEgetKontor] = useState<boolean>(window.localStorage.getItem(flyttetBrukerTilEgetKontorKey) != null);

	const registrerAtVeilederHarFlyttetBrukerTilEgetKontor = () => {
		setHarFlyttetBrukerTilEgetKontor(true);
		localStorage.setItem(flyttetBrukerTilEgetKontorKey, Date.now().toString());
	}

	const slettUtlopteInnslagAvFlyttetBrukerTilEgetKontor = () => {
		const now = Date.now();
		const enTimeMillis = 3600000;
		const lagredeItems = Object.keys(localStorage).filter((key) => key.startsWith(keyPrefix));
		lagredeItems.forEach((key) => {
			const timestamp = Number(localStorage[key]);
			const harUtlopt = (now - enTimeMillis) > timestamp;
			if (harUtlopt) {
				localStorage.removeItem(key);
			}
		})
	}

	return { harFlyttetBrukerTilEgetKontor, setHarFlyttetBrukerTilEgetKontor: registrerAtVeilederHarFlyttetBrukerTilEgetKontor, slettUtlopteInnslagAvFlyttetBrukerTilEgetKontor };
}

export default useHarFlyttetBrukerTilEgetKontor;