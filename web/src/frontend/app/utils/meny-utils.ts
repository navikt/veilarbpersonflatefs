import * as queryString from 'query-string';

import { hentFodselsnummerFraURL } from '../eventhandtering';
import { veilarbpersonflatefsLenker } from '../lenker';


const handlePersonsokSubmit = (fnr: Fnr): void => {
    window.location.pathname = `veilarbpersonflatefs/${fnr}`;
};

const erstattFodselsnummerPlaceholder = (lenke: string): string => {
    const fodselsnummer = hentFodselsnummerFraURL();

    if (!fodselsnummer) {
        return lenke.replace('{{fodselsnummer}}', '');
    }
    return lenke.replace('{{fodselsnummer}}', fodselsnummer);
};

const finnMiljoStreng = (): string => {
    const host = window.location.host;
    const bindestrekIndex = host.indexOf('-');
    if (bindestrekIndex === -1) {
        return '';
    }
    const dotIndex = host.indexOf('.');
    return host.substring(bindestrekIndex + 1, dotIndex);
};

export const erstattMiljoPlaceholder = (lenke: string): string => {
    const miljoStreng = finnMiljoStreng();
    if (miljoStreng) {
        return lenke.replace('{{miljoStreng}}', `-${miljoStreng}`);
    }
    return lenke.replace('{{miljoStreng}}', miljoStreng);
};

const erstattEnhetPlaceholder = (lenke: string): string => {
    const queries = queryString.parse(location.search);
    const valgtEnhet = queries.enhet;
    return lenke.replace('{{enhet}}', valgtEnhet);
};

const erstattPlaceholders = (lenkeObjekt): string => {
    const resultat = lenkeObjekt;
    resultat[0] = erstattFodselsnummerPlaceholder(resultat[0]);
    resultat[0] = erstattMiljoPlaceholder(resultat[0]);
    resultat[0] = erstattEnhetPlaceholder(resultat[0]);
    return resultat;
};

const erstattPlaceholdersForLenker = lenkeObjekter => lenkeObjekter.map(erstattPlaceholders);

interface Config {
    config: {
        toggles: {
            visEnhet: boolean,
            visEnhetVelger: boolean,
            visSokefelt: boolean,
            visVeileder: boolean,
        },
        egendefinerteLenker: {
            lenker: (lenker: any) => any,
            tittel: string,
        },
        handlePersonsokSubmit: (fnr: Fnr) => void,
        applicationName: string
    };
}

const config = (): Config => ({
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
        handlePersonsokSubmit,
        applicationName: 'Arbeidsrettet oppfølging'
    }
});



export const initialiserToppmeny = (): void => {
    (window as any).renderDecoratorHead(config());
};
