import { useEffect, useState } from 'react';

const keyPrefix = 'harFlyttetBrukerTilEgetKontor';

const useHarFlyttetBrukerTilEgetKontor = (brukerFnr: string) => {
	const flyttetBrukerTilEgetKontorKey = `${keyPrefix}-${brukerFnr}`;
	const [harFlyttetBrukerTilEgetKontor, setHarFlyttetBrukerTilEgetKontor] = useState<boolean>(
		window.localStorage.getItem(flyttetBrukerTilEgetKontorKey) != null
	);

	useEffect(() => {
		setHarFlyttetBrukerTilEgetKontor(window.localStorage.getItem(flyttetBrukerTilEgetKontorKey) != null);
	}, [brukerFnr]);

	const registrerAtVeilederHarFlyttetBrukerTilEgetKontor = () => {
		setHarFlyttetBrukerTilEgetKontor(true);
		localStorage.setItem(flyttetBrukerTilEgetKontorKey, Date.now().toString());
	};

	return {
		harFlyttetBrukerTilEgetKontor,
		setHarFlyttetBrukerTilEgetKontor: registrerAtVeilederHarFlyttetBrukerTilEgetKontor
	};
};

export const useSlettUtlopteInnslagAvFlyttetBrukerTilEgetKontorOnMount = () => {
	const slettUtlopteInnslagAvFlyttetBrukerTilEgetKontor = () => {
		const now = Date.now();
		const enTimeMillis = 3600000;
		const lagredeItems = Object.keys(localStorage).filter(key => key.startsWith(keyPrefix));
		lagredeItems.forEach(key => {
			const timestamp = Number(localStorage[key]);
			const harUtlopt = now - enTimeMillis > timestamp;
			if (harUtlopt) {
				localStorage.removeItem(key);
			}
		});
	};

	useEffect(() => {
		slettUtlopteInnslagAvFlyttetBrukerTilEgetKontor();
	}, []);
};

export default useHarFlyttetBrukerTilEgetKontor;
