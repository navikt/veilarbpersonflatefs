import { enhetFinnesIUrl, hentEnhetIdFraUrl, hentFnrFraURL, utledMiljoFraHost } from './url-utils';

describe('URL utils', () => {
	beforeEach(() => history.replaceState({}, 'Login', '/login'));
	afterEach(() => history.replaceState({}, 'Home', '/'));

	describe('enhetFraUrl', () => {
		it('skal hente enhet fra URL', () => {
			const enhet = '0134';
			history.replaceState({}, 'Test', `/test?enhet=${enhet}&chewie=kul`);
			expect(hentEnhetIdFraUrl()).toBe(enhet);
		});
	});
	describe('enhetFinnesIUrl', () => {
		it('skal bekrefte at enhet finnes som query param i URL', () => {
			const enhet = '0134';
			history.replaceState({}, 'Test', `/test?enhet=${enhet}&chewie=kul`);
			expect(enhetFinnesIUrl()).toBeTruthy();
		});
		it('skal bekrefte at enhet IKKE finnes som query param i URL', () => {
			history.replaceState({}, 'Test', `/test?chewie=kul`);
			expect(enhetFinnesIUrl()).toBeFalsy();
		});
	});
	describe('utledMiljoFraHost', () => {
		it('skal returnere tom streng når miljø er produksjon', () => {
			const host = 'app.adeo.no';
			expect(utledMiljoFraHost(host)).toBe('');
		});
		it('skal returnere tom streng når miljø er localhost', () => {
			const host = 'localhost:8080';
			expect(utledMiljoFraHost(host)).toBe('');
		});
		it('skal returnere tom streng når miljø er 127.0.0.1', () => {
			const host = '127.0.0.1:8080';
			expect(utledMiljoFraHost(host)).toBe('');
		});
		it('skal returnere \'-t4\' når miljø er t4', () => {
			const host = 'veilederflatehendelser-t4.adeo.no';
			expect(utledMiljoFraHost(host)).toBe('-t4');
		});
		it('skal returnere \'-q4\' når miljø er q4', () => {
			const host = 'app-q4.adeo.no';
			expect(utledMiljoFraHost(host)).toBe('-q4');
		});
	});
});

describe('person er satt i URL', () => {
	it('fnr i URL skal gi true', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/12345678912');
		const personIUrl = hentFnrFraURL();
		expect(!!personIUrl).toBe(true);
	});

	it('fnr ikke i URL skal gi false', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/');
		const personIUrl = hentFnrFraURL();
		expect(!!personIUrl).toBe(false);
	});

	it('støtter å sjekke fnr i dype urls', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/12345678912/aktivitet/123');
		const personIUrl = hentFnrFraURL();
		expect(!!personIUrl).toBe(true);
	});
});

describe('hent Fodselsnummer Fra URL', () => {
	it('hente fnr fra url', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/12345678912');
		const personIUrl = hentFnrFraURL();
		expect(personIUrl).toBe('12345678912');
	});

	it('hente fnr fra url uten fnr', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/');
		const personIUrl = hentFnrFraURL();
		expect(personIUrl).toBe(undefined);
	});

	it('hente fnr fra dyp url', () => {
		history.replaceState({}, 'Test', '/veilarbpersonflatefs/12345678912/aktivitet/123');
		const personIUrl = hentFnrFraURL();
		expect(personIUrl).toBe('12345678912');
	});
});
