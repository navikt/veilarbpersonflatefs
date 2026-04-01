export class HttpError extends Error {
	readonly status: number;
	constructor(status: number, statusText: string) {
		super(`HTTP error ${status}: ${statusText}`);
		this.name = 'HttpError';
		this.status = status;
	}
}

const defaultHeaders: HeadersInit = {
	'Nav-Consumer-Id': 'veilarbpersonflatefs',
	'Content-Type': 'application/json',
};

export async function fetchWithHeaders<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(url, {
		credentials: 'include',
		...options,
		headers: { ...defaultHeaders, ...(options?.headers ?? {}) },
	});
	if (!response.ok) {
		throw new HttpError(response.status, response.statusText);
	}
	const contentType = response.headers.get('content-type');
	if (contentType?.includes('application/json')) {
		return response.json();
	}
	return undefined as T;
}

export type UseQueryResponseValue<T> = {
	data: T | undefined;
	loading: boolean;
	error: Error | null;
	fetch: () => Promise<any>;
};

export function isAnyLoading(...queryResponseValues: UseQueryResponseValue<any>[]): boolean {
	return queryResponseValues.some(v => v.loading);
}

export function hasAnyFailed(...queryResponseValues: UseQueryResponseValue<any>[]): boolean {
	return queryResponseValues.some(v => v.error !== null);
}
