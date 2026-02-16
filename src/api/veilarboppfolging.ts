 import { AxiosPromise } from 'axios';
import { axiosInstance } from './utils';

export function synkroniserManuellStatusMedDkif(fnr: string): AxiosPromise<null> {
	return axiosInstance.post(`/veilarboppfolging/api/v3/manuell/synkroniser-med-dkif`, { fnr });
}

const graphqlUrl = '/veilarboppfolging/api/graphql';

const query = `
  query($fnr: String!) {
    oppfolgingsEnhet(fnr: $fnr) {
        enhet {
            navn,
            id,
            kilde
        }
    }
    oppfolging(fnr: $fnr) {
    	erUnderOppfolging,
        kanStarteOppfolging
    }
  }
`

const graphqlBody = (fnr: string) => ({
	query,
	variables: {
		fnr,
	},
})

interface Enhet {
	id: string
	navn: string
	kilde: string
}

export type KanIkkeStarteOppfolgingPgaIkkeTilgang =
	| 'IKKE_TILGANG_FORTROLIG_ADRESSE'
	| 'IKKE_TILGANG_STRENGT_FORTROLIG_ADRESSE'
	| 'IKKE_TILGANG_EGNE_ANSATTE'
	| 'IKKE_TILGANG_ENHET'
	| 'IKKE_TILGANG_MODIA'
export type KanIkkeStartePgaFolkeregisterStatus =
	| 'DOD'
	| 'IKKE_LOVLIG_OPPHOLD'
	| 'UKJENT_STATUS_FOLKEREGISTERET'
	| 'INGEN_STATUS_FOLKEREGISTERET'
export type KanStarteOppfolging =
	| 'JA'
	| 'JA_MED_MANUELL_GODKJENNING_PGA_IKKE_BOSATT' // Manuell dokumentering/godkjenning på at bruker har lovlig opphold
	| 'JA_MED_MANUELL_GODKJENNING_PGA_DNUMMER_IKKE_EOS_GBR' // Manuell dokumentering/godkjenning på at bruker har lovlig opphold
	| 'ALLEREDE_UNDER_OPPFOLGING'
	| 'ALLEREDE_UNDER_OPPFOLGING_MEN_INAKTIVERT' // Disse kan reaktiveres (foreløpig)
	| 'ALLEREDE_UNDER_OPPFOLGING_MEN_INAKTIVERT_MEN_KREVER_MANUELL_GODKJENNING_PGA_IKKE_BOSATT'
	| 'ALLEREDE_UNDER_OPPFOLGING_MEN_INAKTIVERT_MEN_KREVER_MANUELL_GODKJENNING_PGA_DNUMMER_IKKE_EOS_GBR'
	| KanIkkeStarteOppfolgingPgaIkkeTilgang
	| KanIkkeStartePgaFolkeregisterStatus

export interface GraphqlSuccessResponse {
	data: {
		oppfolging: {
			erUnderOppfolging: boolean,
			kanStarteOppfolging: KanStarteOppfolging
		}
		oppfolgingsEnhet: {
			enhet?: Enhet
		}
	}
}

interface GraphqlErrorResponse {
	ok: false
	type: 'GraphqlError'
	error: Error
}

type GraphqlResponse =
	| { errors: { message: string }[] }
	| GraphqlSuccessResponse

export const getOppfolgingStatus = async (fnr: string) => {
	const response = await resilientFetch<GraphqlResponse>(graphqlUrl, {
		body: JSON.stringify(graphqlBody(fnr)),
		headers: {
			Accept: 'application/json',
			['Nav-Consumer-Id']: 'inngar',
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
	return response as Success<GraphqlSuccessResponse> | HttpError | FetchError
}

export interface Success<T> {
	ok: true
	result: Response
	data: T
}

export interface HttpError {
	ok: false
	type: 'HttpError'
	errorBody: string
	status: number
	error: Error
}

export interface FetchError {
	ok: false
	type: 'FetchError'
	error: Error
}

const getBodyTypeFromHeaders = (headers: Headers) => {
	const contentType = headers.get('content-type')
	if (contentType?.includes('application/json')) {
		return 'json'
	} else if (contentType?.includes('text/html')) {
		return 'text'
	} else {
		return 'unknown'
	}
}

const getUrlString = (request: RequestInfo | URL) => {
	if (request instanceof URL) {
		return request.toString()
	} else if (typeof request === 'string') {
		return request.toString()
	} else {
		return request.url
	}
}

export const resilientFetch = async <T>(
	request: RequestInfo | URL,
	config?: RequestInit,
) => {
	try {
		const result = await fetch(request, config)
		const bodyType = getBodyTypeFromHeaders(result.headers)
		if (result.ok) {
			return {
				ok: true as const,
				result,
				data:
					bodyType === 'json'
						? await result.json()
						: await result.text(),
			} as Success<T>
		} else {
			const body =
				(await result.text()) ||
				`Http error: ${result.url} ${result.status}`
			return {
				type: 'HttpError' as const,
				ok: false as const,
				error: new Error(body),
				status: result.status,
				errorBody: body,
			} as HttpError
		}
	} catch (e: unknown) {
		if (e instanceof Error) {
			return {
				type: 'FetchError' as const,
				ok: false as const,
				error: new Error(`Failed to fetch ${getUrlString(request)}`),
			} as FetchError
		} else {
			return {
				ok: false as const,
				type: 'FetchError' as const,
				error: new Error(`Unknown error ${e.toString()}`),
			} as FetchError
		}
	}
}