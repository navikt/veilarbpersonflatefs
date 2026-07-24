import { fetchWithHeaders } from './utils';
import { FetchError, GraphqlErrorResponse, GraphqlResponse, HttpError, resilientFetch, Success } from './graphql';

export function synkroniserManuellStatusMedDkif(fnr: string): Promise<void> {
	return fetchWithHeaders(`/veilarboppfolging/api/v3/manuell/synkroniser-med-dkif`, {
		method: 'POST',
		body: JSON.stringify({ fnr })
	});
}

const graphqlUrl = '/veilarboppfolging/api/graphql';

const tilgangFlytteBrukerTilEgetKontorQuery = `
  query($fnr: String!) {
    veilederTilgang(fnr: $fnr) {
		harVeilederTilgangFlytteBrukerTilEgetKontor
		harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor
    }
  }
`;

const leseTilgangTilEksternBrukerQuery = `
  query($fnr: String!) {
    veilederTilgang(fnr: $fnr) {
    	harVeilederLeseTilgangTilBruker
    }
  }
`;

const graphqlBody = (fnr: string, query: string) => ({
	query,
	variables: {
		fnr
	}
});

export interface TilgangFlyttBrukerTilEgetKontorSuccessResponse {
	data: {
		veilederTilgang: {
			harVeilederTilgangFlytteBrukerTilEgetKontor: boolean;
			harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor: boolean;
		};
	};
}

export interface LeseTilgangTilEksternBrukerSuccessResponse {
	data: {
		veilederTilgang: {
			harVeilederLeseTilgangTilBruker: boolean;
		};
	};
}

const headers = {
	Accept: 'application/json',
	['Nav-Consumer-Id']: 'veilarbpersonflatefs',
	['Content-Type']: 'application/json'
};

export const getHarVeilederLeseTilgangTilEksternBruker = async (fnr: string) => {
	const response = await resilientFetch<GraphqlResponse>(graphqlUrl, {
		body: JSON.stringify(graphqlBody(fnr, leseTilgangTilEksternBrukerQuery)),
		headers,
		method: 'POST'
	});
	if (response.ok) {
		if ('errors' in response.data) {
			const errorMessage = response.data.errors?.map(it => it.message).join(',');
			return {
				ok: false as const,
				type: 'GraphqlError' as const,
				error: new Error(`GraphqlError: ${errorMessage}`)
			} as GraphqlErrorResponse;
		}
	}
	return response as Success<LeseTilgangTilEksternBrukerSuccessResponse> | HttpError | FetchError;
};

export const getHarVeilederTilgangFlytteBrukerTilEgetKontor = async (fnr: string) => {
	const response = await resilientFetch<GraphqlResponse>(graphqlUrl, {
		body: JSON.stringify(graphqlBody(fnr, tilgangFlytteBrukerTilEgetKontorQuery)),
		headers,
		method: 'POST'
	});
	if (response.ok) {
		if ('errors' in response.data) {
			const errorMessage = response.data.errors?.map(it => it.message).join(',');
			return {
				ok: false as const,
				type: 'GraphqlError' as const,
				error: new Error(`GraphqlError: ${errorMessage}`)
			} as GraphqlErrorResponse;
		}
	}
	return response as Success<TilgangFlyttBrukerTilEgetKontorSuccessResponse> | HttpError | FetchError;
};
