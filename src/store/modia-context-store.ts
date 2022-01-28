import { useState } from 'react';
import constate from 'constate';

export const [ModiaContextStore, useModiaContextStore] = constate((initalValues: { fnr: string }) => {
	const [aktivBrukerFnr, setAktivBrukerFnr] = useState<string>(initalValues.fnr);
	const [aktivEnhetId, setAktivEnhetId] = useState<string>();

	return { aktivBrukerFnr, setAktivBrukerFnr, aktivEnhetId, setAktivEnhetId };
});
