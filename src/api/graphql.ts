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

export interface GraphqlErrorResponse {
    ok: false
    type: 'GraphqlError'
    error: Error
}

interface SuccessResponse<T> {
    data: T
}

export type GraphqlResponse =
    | { errors: { message: string }[] }
    | SuccessResponse<any>

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