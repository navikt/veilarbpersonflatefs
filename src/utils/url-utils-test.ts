import { enhetFinnesIUrl, enhetFraUrl, utledMiljoFraHost } from './url-utils';

describe('URL utils', () => {
    describe('enhetFraUrl', () => {
        it('skal hente enhet fra URL', () => {
            const enhet = '0134';

            (global as any).window = {
                location: {
                    search: `?enhet=${enhet}&chewie=kul`
                }
            };

            expect(enhetFraUrl()).toBe(enhet);
        });
    });
    describe('enhetFinnesIUrl', () =>  {
        it('skal bekrefte at enhet finnes som query param i URL', () => {
            const enhet = '0134';

            (global as any).window = {
                location: {
                    search: `?enhet=${enhet}&chewie=kul`
                }
            };

            expect(enhetFinnesIUrl()).toBeTruthy();
        });
        it('skal bekrefte at enhet IKKE finnes som query param i URL', () => {
            (global as any).window = {
                location: {
                    search: `?deathstar=round&chewie=kul`
                }
            };

            expect(enhetFinnesIUrl()).toBeFalsy()
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
