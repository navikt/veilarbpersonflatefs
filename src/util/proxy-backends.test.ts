import { describe, expect, it } from 'vitest';
import { resolveProxyBackendFromUrl } from './proxy-backends';

describe('resolveProxyBackendFromUrl', () => {
	it('finner proxy for eksakt sti og undersider', () => {
		const backend = {
			fromPath: '/veilarbdialog',
			toApp: { name: 'veilarbdialog', namespace: 'dab' }
		};

		expect(resolveProxyBackendFromUrl('/veilarbdialog')).toEqual(backend);
		expect(resolveProxyBackendFromUrl('/veilarbdialog/api/dialog')).toEqual(backend);
	});

	it('bruker stien fra en absolutt URL', () => {
		expect(resolveProxyBackendFromUrl('https://app.nav.no/please/ws?x=1')).toEqual({
			fromPath: '/please',
			toApp: { name: 'please', namespace: 'dab' }
		});
	});

	it('matcher ikke en sti med lignende prefiks', () => {
		expect(resolveProxyBackendFromUrl('/veilarbpersonflate')).toBeUndefined();
	});

	it('returnerer undefined for ugyldig URL eller manglende verdi', () => {
		expect(resolveProxyBackendFromUrl('not a URL')).toBeUndefined();
		expect(resolveProxyBackendFromUrl()).toBeUndefined();
	});
});
