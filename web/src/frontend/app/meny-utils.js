import { hentFodselsnummerFraURL } from './eventhandtering';


const erstattPlaceholders = (lenke) => {
    const fodselsnummer = hentFodselsnummerFraURL();

    const url = lenke;
    if (!fodselsnummer) {
        url[0] = lenke[0].replace('{{fodselsnummer}}', '');
    } else {
        url[0] = lenke[0].replace('{{fodselsnummer}}', fodselsnummer);
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
                ['/veilarbportefoljeflatefs/tilbaketilenhet', 'Enhetens oversikt'],
                ['/veilarbportefoljeflatefs/tilbaketilveileder', 'Min oversikt'],
                ['/modiabrukerdialog/person/{{fodselsnummer}}', 'Modia']
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
