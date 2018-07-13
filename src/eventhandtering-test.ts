import { hentFodselsnummerFraURL } from './eventhandtering';

describe('person er satt i URL', () => {
    it('fnr i URL skal gi true', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912'
            }
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(!!personIUrl).toBe(true);
    });

    it('fnr ikke i URL skal gi false', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/'
            }
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(!!personIUrl).toBe(false);
    });

    it('støtter å sjekke fnr i dype urls', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912/aktivitet/123'
            }
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(!!personIUrl).toBe(true);
    });
});

describe('hent Fodselsnummer Fra URL', () => {
    it('hente fnr fra url', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912'
            }
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(personIUrl).toBe('12345678912');
    });

    it('hente fnr fra url uten fnr', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/'
            }
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(personIUrl).toBe(null);
    });

    it('hente fnr fra dyp url', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912/aktivitet/123'
            }
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(personIUrl).toBe('12345678912');
    });
});
