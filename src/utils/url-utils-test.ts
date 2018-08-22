import {
    enhetFinnesIUrl,
    enhetFraUrl,
    hentFodselsnummerFraURL,
    utledMiljoFraHost,
} from './url-utils';

describe('URL utils', () => {
    describe('enhetFraUrl', () => {
        it('skal hente enhet fra URL', () => {
            const enhet = '0134';

            (global as any).window = {
                location: {
                    search: `?enhet=${enhet}&chewie=kul`,
                },
            };

            expect(enhetFraUrl()).toBe(enhet);
        });
    });
    describe('enhetFinnesIUrl', () => {
        it('skal bekrefte at enhet finnes som query param i URL', () => {
            const enhet = '0134';

            (global as any).window = {
                location: {
                    search: `?enhet=${enhet}&chewie=kul`,
                },
            };

            expect(enhetFinnesIUrl()).toBeTruthy();
        });
        it('skal bekrefte at enhet IKKE finnes som query param i URL', () => {
            (global as any).window = {
                location: {
                    search: `?deathstar=round&chewie=kul`,
                },
            };

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
        it("skal returnere '-t4' når miljø er t4", () => {
            const host = 'veilederflatehendelser-t4.adeo.no';
            expect(utledMiljoFraHost(host)).toBe('-t4');
        });
        it("skal returnere '-q4' når miljø er q4", () => {
            const host = 'app-q4.adeo.no';
            expect(utledMiljoFraHost(host)).toBe('-q4');
        });
    });
});

describe('person er satt i URL', () => {
    it('fnr i URL skal gi true', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912',
            },
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(!!personIUrl).toBe(true);
    });

    it('fnr ikke i URL skal gi false', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/',
            },
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(!!personIUrl).toBe(false);
    });

    it('støtter å sjekke fnr i dype urls', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912/aktivitet/123',
            },
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(!!personIUrl).toBe(true);
    });
});

describe('hent Fodselsnummer Fra URL', () => {
    it('hente fnr fra url', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912',
            },
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(personIUrl).toBe('12345678912');
    });

    it('hente fnr fra url uten fnr', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/',
            },
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(personIUrl).toBe(null);
    });

    it('hente fnr fra dyp url', () => {
        (global as any).window = {
            location: {
                pathname: '/veilarbpersonflatefs/12345678912/aktivitet/123',
            },
        };

        const personIUrl = hentFodselsnummerFraURL();
        expect(personIUrl).toBe('12345678912');
    });
});
