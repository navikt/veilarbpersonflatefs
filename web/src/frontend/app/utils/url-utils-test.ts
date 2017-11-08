import { expect } from 'chai';
import { enhetFinnesIUrl, enhetFraUrl } from './url-utils';

describe('URL utils', () => {
    describe('enhetFraUrl', () => {
        it('skal hente enhet fra URL', () => {
            const enhet = '0134';

            (global as any).window = {
                location: {
                    search: `?enhet=${enhet}&chewie=kul`
                }
            };

            expect(enhetFraUrl()).to.equal(enhet);
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

            expect(enhetFinnesIUrl()).to.be.true; // tslint:disable-line
        });
        it('skal bekrefte at enhet IKKE finnes som query param i URL', () => {
            (global as any).window = {
                location: {
                    search: `?deathstar=round&chewie=kul`
                }
            };

            expect(enhetFinnesIUrl()).to.be.false; // tslint:disable-line
        });
    });
});
