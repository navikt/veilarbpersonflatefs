import { expect } from 'chai';
import { erstattMiljoPlaceholder } from './dekorator-utils';
import { modiaTemplateUrl } from '../lenker';

describe('erstattMiljoPlaceholder', () => {
    it('skal gi riktig lenke i t4', () => {
        (global as any).window = {
            location: {
                host: 'app-t4.adeo.no'
            }
        };
        const lenke = erstattMiljoPlaceholder(modiaTemplateUrl);
        expect(lenke).to.equal('https://modapp-t4.adeo.no/modiabrukerdialog/person/{{fodselsnummer}}');
    });

    it('skal gi riktig lenke i prod', () => {
        (global as any).window = {
            location: {
                host: 'app.adeo.no'
            }
        };

        const lenke = erstattMiljoPlaceholder(modiaTemplateUrl);
        expect(lenke).to.equal('https://modapp.adeo.no/modiabrukerdialog/person/{{fodselsnummer}}');
    });
});
