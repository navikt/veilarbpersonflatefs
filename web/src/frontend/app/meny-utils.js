import { hentPersonnummerFraURL } from './eventhandtering';

const menyValgliste = [
    {
        url: '/veilarbportefoljeflatefs/enhet?enhet={{enhet}}&ident={{ident}}',
        tekst: 'Enhetsportefølje'
    },
    {
        url: '/veilarbportefoljeflatefs/enhet?enhet={{enhet}}&ident={{ident}}',
        tekst: 'Veilederportefølje'
    },
    {
        url: '/modiabrukerdialog/person/{{personnummer}}',
        tekst: 'Modia'
    }
];

const erstattPlaceholders = (url) => {
    const saksbehandlerIdent = 'z990301';
    const enhet = '0356';
    const personnummer = hentPersonnummerFraURL();

    return url
        .replace('{{enhet}}', enhet)
        .replace('{{ident}}', saksbehandlerIdent)
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
