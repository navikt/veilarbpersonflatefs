interface Kontor {
	kontorNavn: string;
	kontorId: string;
}

interface SettKontorResponse {
	fraKontor?: Kontor;
	tilKontor: Kontor;
}

export const settKontor = async (fnr: string, kontorId: string): Promise<SettKontorResponse> => {
	const response = await fetch(`/ao-oppfolgingskontor/api/kontor`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ kontorId, ident: fnr })
	});
	if (!response.ok) {
		throw new Error(`Feil ved oppdatering av kontor: ${response.statusText}`);
	}
	return response.json();
};
