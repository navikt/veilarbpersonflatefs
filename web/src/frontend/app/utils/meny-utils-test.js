import { expect } from 'chai';
import { erstattMiljoPlaceholder } from './meny-utils';
import { modiaTemplateUrl } from '../lenker';

describe('erstattMiljoPlaceholder', () => {
    it('skal gi riktig lenke i t4', () => {
        global.window = {
            location: {
                host: 'modapp-t4.adeo.no'
            }
        };

        const lenke = erstattMiljoPlaceholder(modiaTemplateUrl);
        expect(lenke).to.equal('https://modapp-t4.adeo.no/modiabrukerdialog/person/{{fodselsnummer}}');
    });

    it('skal gi riktig lenke i prod', () => {
        global.window = {
            location: {
                host: 'modapp.adeo.no'
            }
        };

        const lenke = erstattMiljoPlaceholder(modiaTemplateUrl);
        expect(lenke).to.equal('https://modapp.adeo.no/modiabrukerdialog/person/{{fodselsnummer}}');
    });
});
