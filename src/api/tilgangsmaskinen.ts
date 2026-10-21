export const beOmEnkelttilgang = async (brukerId: string, begrunnelse: string, gyldigtil: string): Promise<void> => {
	const response = await fetch(`/tilgangsmaskin/api/v1/overstyr`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ brukerId, begrunnelse, gyldigtil})
	});
	if (!response.ok) {
		throw new Error(`Feil ved overstyring av tilgang: ${response.statusText}`);
	}
};
