
const BASE_URL = '/veilarbpersonflatefs/';

const settPersonIURL = (fodselsnummer) => {
    window.history.pushState(`Endret fodselsnummer til ${fodselsnummer}`, '', `${BASE_URL}${fodselsnummer}`);
};

const regex = `^${BASE_URL}(\\d+)`;

export const personErSattIURL = () => {
    const url = window.location.pathname;
    return url.match(regex);
};

export const hentFodselsnummerFraURL = () => {
    const url = window.location.pathname;
    const match = url.match(regex);
    if (match && match.length === 2) {
        return match[1];
    }
    return null;
};

let forrigeFodselsnummer;
const sendEventOmPersonFraURL = () => {
    if (personErSattIURL()) {
        const fodselsnummer = hentFodselsnummerFraURL();
        if (fodselsnummer !== forrigeFodselsnummer) {
            forrigeFodselsnummer = fodselsnummer;
            const personsokEvent = document.createEvent('Event');
            personsokEvent.initEvent('flate-person-endret', true, true);
            personsokEvent.fodselsnummer = fodselsnummer;
            document.dispatchEvent(personsokEvent);
        }
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
