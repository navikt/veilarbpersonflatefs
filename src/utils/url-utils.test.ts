import { hentFnrFraUrl } from './url-utils';

describe('person er satt i URL', () => {
	it('fnr i URL skal gi true', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/12345678912');
		const personIUrl = hentFnrFraUrl();
		expect(!!personIUrl).toBe(true);
	});

	it('fnr ikke i URL skal gi false', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/');
		const personIUrl = hentFnrFraUrl();
		expect(!!personIUrl).toBe(false);
	});

	it('støtter å sjekke fnr i dype urls', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/12345678912/aktivitet/123');
		const personIUrl = hentFnrFraUrl();
		expect(!!personIUrl).toBe(true);
	});
});

describe('hent Fodselsnummer Fra URL', () => {
	it('hente fnr fra url', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/12345678912');
		const personIUrl = hentFnrFraUrl();
		expect(personIUrl).toBe('12345678912');
	});

	it('hente fnr fra url uten fnr', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/');
		const personIUrl = hentFnrFraUrl();
		expect(personIUrl).toBe(undefined);
	});

	it('hente fnr fra dyp url', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/12345678912/aktivitet/123');
		const personIUrl = hentFnrFraUrl();
		expect(personIUrl).toBe('12345678912');
	});
});
