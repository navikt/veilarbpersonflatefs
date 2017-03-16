import { hentPersonnummerFraURL } from './eventhandtering';

const menyValgliste = [
    {
        url: '/mia/ledigestillinger',
        tekst: 'Arbeidsmarkedet'
    },
    {
        url: '/veilarbportefoljeflatefs/enhet',
        tekst: 'Enhetsportefølje'
    },
    {
        url: '/veilarbportefoljeflatefs/portefolje',
        tekst: 'Veilederportefølje'
    },
    {
        url: '/modiabrukerdialog/person/{{personnummer}}',
        tekst: 'Modia'
    }
];

const erstattPlaceholders = (url) => {
    const personnummer = hentPersonnummerFraURL();

    return url
        .replace('{{personnummer}}', personnummer);
};

const konverterTilHtml = (menyvalg) => {
    const url = erstattPlaceholders(menyvalg.url);
    return (`<li><a href=${url}>${menyvalg.tekst}</a></li>\n`);
};

export const lagHtmlMeny = () => {
    const listeHtml = menyValgliste.map(valg => konverterTilHtml(valg))
        .reduce((acc, val) => acc + val);
    return `<ul>${listeHtml}</ul>`;
};
