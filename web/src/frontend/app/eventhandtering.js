
const BASE_URL = '/veilarbpersonflatefs/';

const settPersonIURL = (fodselsnummer) => {
    window.history.pushState(`Endret fodselsnummer til ${fodselsnummer}`, '', `${BASE_URL}${fodselsnummer}`);
};

const personErSattIURL = () => {
    const url = window.location.pathname;
    const regex = new RegExp(/^/.source + BASE_URL + /\d+\/?$/.source);
    return url.match(regex);
};

export const hentFodselsnummerFraURL = () => {
    const url = window.location.pathname;
    const regex = new RegExp(/^/.source + BASE_URL + /(\d+)\/?$/.source);
    const match = url.match(regex);
    if (match && match.length === 2) {
        return match[1];
    }
    return null;
};

const sendEventOmPersonFraURL = () => {
    if (personErSattIURL()) {
        const personsokEvent = document.createEvent('Event');
        personsokEvent.initEvent('flate-person-endret', true, true);
        personsokEvent.fodselsnummer = hentFodselsnummerFraURL();
        document.dispatchEvent(personsokEvent);
    }
};

export const initialiserEventhandtering = () => {
    window.onload = sendEventOmPersonFraURL;
    window.onpopstate = sendEventOmPersonFraURL;

    document.addEventListener('dekorator-hode-personsok', (event) => {
        settPersonIURL(event.fodselsnummer);
        sendEventOmPersonFraURL();
    });
};
