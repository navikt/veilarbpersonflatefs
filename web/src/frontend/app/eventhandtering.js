
const BASE_URL = '/veilarbpersonflatefs/';

const settPersonIURL = (personnummer) => {
    window.history.pushState(`Endret personnummer til ${personnummer}`, '', `${BASE_URL}${personnummer}`);
};

const personErSattIURL = () => {
    const url = window.location.pathname;
    const regex = new RegExp(/^/.source + BASE_URL + /\d+\/?$/.source);
    return url.match(regex);
};

const hentPersonnummerFraURL = () => {
    const url = window.location.pathname;
    const regex = new RegExp(/^/.source + BASE_URL + /(\d+)\/?$/.source);
    const match = url.match(regex);
    if (match.length === 2) {
        return match[1];
    }
    return null;
};

const sendEventOmPersonFraURL = () => {
    if (personErSattIURL()) {
        const personsokEvent = document.createEvent('Event');
        personsokEvent.initEvent('flate-person-endret', true, true);
        personsokEvent.personnummer = hentPersonnummerFraURL();
        document.dispatchEvent(personsokEvent);
    }
};

export const initialiserEventhandtering = () => {
    window.onload = sendEventOmPersonFraURL;
    window.onpopstate = sendEventOmPersonFraURL;

    document.addEventListener('dekorator-hode-personsok', (event) => {
        settPersonIURL(event.personnummer);
        sendEventOmPersonFraURL();
    });
};
