import axios from 'axios';

interface Kontor {
	kontorNavn: string;
	kontorId: string;
}

interface SettKontorResponse {
	fraKontor: Kontor;
	tilKontor: Kontor;
}

export function settKontor(fnr: string, kontorId: string): Promise<SettKontorResponse> {
    return axios.post(`/ao-oppfolgingskontor/api/kontor`, { kontorId, ident: fnr })
}