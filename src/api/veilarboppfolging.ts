 import { AxiosPromise } from 'axios';
import { axiosInstance } from './utils';
 import { FetchError, GraphqlErrorResponse, GraphqlResponse, HttpError, resilientFetch, Success } from './graphql';

export function synkroniserManuellStatusMedDkif(fnr: string): AxiosPromise<null> {
	return axiosInstance.post(`/veilarboppfolging/api/v3/manuell/synkroniser-med-dkif`, { fnr });
}

const graphqlUrl = '/veilarboppfolging/api/graphql';

const tilgangFlytteBrukerTilEgetKontorQuery = `
  query($fnr: String!) {
    veilederTilgang(fnr: $fnr) {
		harVeilederTilgangFlytteBrukerTilEgetKontor
		harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor
    }
  }
`

const graphqlBody = (fnr: string) => ({
	query: tilgangFlytteBrukerTilEgetKontorQuery,
	variables: {
		fnr,
	},
})

export interface TilgangFlyttBrukerTilEgetKontorSuccessResponse {
	data: {
		veilederTilgang: {
			harVeilederTilgangFlytteBrukerTilEgetKontor: boolean;
            harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor: boolean;
		};
	};
}

export const getHarVeilederTilgangFlytteBrukerTilEgetKontor = async (fnr: string) => {
	const response = await resilientFetch<GraphqlResponse>(graphqlUrl, {
		body: JSON.stringify(graphqlBody(fnr)),
		headers: {
			Accept: 'application/json',
			['Nav-Consumer-Id']: 'veilarbpersonflatefs',
			['Content-Type']: 'application/json',
		},
		method: 'POST',
	})
	if (response.ok) {
		if ('errors' in response.data) {
			const errorMessage = response.data.errors
				?.map((it) => it.message)
				.join(',')
			return {
				ok: false as const,
				type: 'GraphqlError' as const,
				error: new Error(`GraphqlError: ${errorMessage}`),
			} as GraphqlErrorResponse
		}
	}
	return response as Success<TilgangFlyttBrukerTilEgetKontorSuccessResponse> | HttpError | FetchError
}
