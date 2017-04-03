import queryString from 'query-string';

import { hentFodselsnummerFraURL } from '../eventhandtering';
import { veilarbpersonflatefsLenker } from '../lenker';

const erstattFodselsnummerPlaceholder = (lenke) => {
    const fodselsnummer = hentFodselsnummerFraURL();

    if (!fodselsnummer) {
        return lenke.replace('{{fodselsnummer}}', '');
    }
    return lenke.replace('{{fodselsnummer}}', fodselsnummer);
};

const finnMiljoStreng = () => {
    const host = window.location.host;
    const bindestrekIndex = host.indexOf('-');
    if (bindestrekIndex === -1) {
        return '';
    }
    const dotIndex = host.indexOf('.');
    return host.substring(bindestrekIndex + 1, dotIndex);
};

export const erstattMiljoPlaceholder = (lenke) => {
    const miljoStreng = finnMiljoStreng();
    if (miljoStreng) {
        return lenke.replace('{{miljoStreng}}', `-${miljoStreng}`);
    }
    return lenke.replace('{{miljoStreng}}', miljoStreng);
};

const erstattEnhetPlaceholder = (lenke) => {
    const queries = queryString.parse(location.search);
    const valgtEnhet = queries.enhet;
    return lenke.replace('{{enhet}}', valgtEnhet);
};

const erstattPlaceholders = (lenkeObjekt) => {
    const resultat = lenkeObjekt;
    resultat[0] = erstattFodselsnummerPlaceholder(resultat[0]);
    resultat[0] = erstattMiljoPlaceholder(resultat[0]);
    resultat[0] = erstattEnhetPlaceholder(resultat[0]);
    return resultat;
};

const erstattPlaceholdersForLenker = lenkeObjekter => lenkeObjekter.map(erstattPlaceholders);

const config = () => ({
    config: {
        toggles: {
            visEnhet: true,
            visEnhetVelger: false,
            visSokefelt: true,
            visVeileder: true
        },
        egendefinerteLenker: {
            lenker: erstattPlaceholdersForLenker(veilarbpersonflatefsLenker.lenker),
            tittel: veilarbpersonflatefsLenker.tittel
        },
        applicationName: 'Oppfølging'
    }
});

export const initialiserToppmeny = () => {
    window.renderDecoratorHead(config());
};
