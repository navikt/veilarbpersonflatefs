import { afterEach, describe, expect, it, vi } from 'vitest';
import { resilientFetch } from './graphql';

afterEach(() => {
	vi.restoreAllMocks();
});

describe('resilientFetch', () => {
	it('leser JSON fra vellykket svar', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'ok' }), {
				headers: { 'content-type': 'application/json' }
			})
		);

		const response = await resilientFetch<{ message: string }>('/api/test');

		expect(response.ok).toBe(true);
		if (response.ok) {
			expect(response.data).toEqual({ message: 'ok' });
		}
	});

	it('returnerer status og innhold ved HTTP-feil', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('Service unavailable', {
				status: 503,
				statusText: 'Service Unavailable'
			})
		);

		const response = await resilientFetch('/api/test');

		expect(response).toMatchObject({
			ok: false,
			type: 'HttpError',
			status: 503,
			errorBody: 'Service unavailable'
		});
	});

	it('returnerer nettverksfeil når forespørselen avvises', async () => {
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network unavailable'));

		const response = await resilientFetch('/api/test');

		expect(response).toMatchObject({
			ok: false,
			type: 'FetchError'
		});
	});
});
