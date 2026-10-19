import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWithHeaders } from './utils';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('fetchWithHeaders', () => {
	it('sender standardheadere og inkluderer cookies ved JSON-svar', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'ok' }), {
				headers: { 'content-type': 'application/json' }
			})
		);

		const response = await fetchWithHeaders<{ message: string }>('/api/test');

		expect(response).toEqual({ message: 'ok' });
		expect(fetchMock).toHaveBeenCalledWith('/api/test', {
			credentials: 'include',
			headers: {
				'Nav-Consumer-Id': 'veilarbpersonflatefs',
				'Content-Type': 'application/json'
			}
		});
	});

	it('slår sammen egne headere med standardheadere', async () => {
		const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

		await fetchWithHeaders<void>('/api/test', {
			method: 'POST',
			headers: {
				'Nav-Consumer-Id': 'custom-consumer',
				'X-Request-Id': 'request-123'
			}
		});

		expect(fetchMock).toHaveBeenCalledWith('/api/test', {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Nav-Consumer-Id': 'custom-consumer',
				'Content-Type': 'application/json',
				'X-Request-Id': 'request-123'
			}
		});
	});

	it('kaster HttpError når serveren svarer med feilstatus', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 503,
				statusText: 'Service Unavailable'
			})
		);

		await expect(fetchWithHeaders('/api/test')).rejects.toMatchObject({
			name: 'HttpError',
			status: 503,
			message: 'HTTP error 503: Service Unavailable'
		});
	});

	it('returnerer undefined når svaret ikke inneholder JSON', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

		await expect(fetchWithHeaders<void>('/api/test')).resolves.toBeUndefined();
	});
});
