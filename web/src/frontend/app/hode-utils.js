import { hentPersonnummerFraURL } from './eventhandtering';


const erstattPlaceholders = lenke => {
    const personnummer = hentPersonnummerFraURL();

    if (!personnummer) {
        lenke[0] = lenke[0].replace('{{personnummer}}', "");
    } else {
        lenke[0] = lenke[0].replace('{{personnummer}}', personnummer);
    }

    return lenke;
};

const erstattPlaceholdersForLenker = lenker => {
    lenker.lenker = lenker.lenker.map(erstattPlaceholders);
    return lenker;
};

const lenker =
    {
        lenker:
            [
                ['/mia/ledigestillinger', 'Arbeidsmarkedet'],
                ['/veilarbportefoljeflatefs/enhet', 'Enhetsportefolje'],
                ['/veilarbportefoljeflatefs/portefolje', 'Veilederportefølje'],
                ['/modiabrukerdialog/person/{{personnummer}}', 'Modia']
            ],
        tittel: ''
    };


const config = {
    config: {
        toggles: {
            visEnhet: true,
            visEnhetVelger: false,
            visSokefelt: true,
            visVeileder: true
        },
        egendefinerteLenker: erstattPlaceholdersForLenker(lenker),
        applicationName: 'Oppfølging'
    }
};

export const initialiserToppmeny = () => {
    window.renderDecoratorHead(config);
};