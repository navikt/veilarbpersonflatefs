import { hentPersonnummerFraURL } from './eventhandtering';


const erstattPlaceholders = (lenke) => {
    const personnummer = hentPersonnummerFraURL();

    const url = lenke;
    if (!personnummer) {
        url[0] = lenke[0].replace('{{personnummer}}', '');
    } else {
        url[0] = lenke[0].replace('{{personnummer}}', personnummer);
    }

    return url;
};

const erstattPlaceholdersForLenker = (lenker) => {
    const lenkeliste = lenker;
    lenkeliste.lenker = lenker.lenker.map(erstattPlaceholders);
    return lenkeliste;
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
