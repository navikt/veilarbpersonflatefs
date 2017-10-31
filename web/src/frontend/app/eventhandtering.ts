const BASE_URL = '/veilarbpersonflatefs/';

export const settPersonIURL = (fodselsnummer: Fnr): void => {
    window.history.pushState(`Endret fodselsnummer til ${fodselsnummer}`, '', `${BASE_URL}${fodselsnummer}`);
};

const regex = `^${BASE_URL}(\\d+)`;

export const personErSattIURL = (): RegExpMatchArray | null => {
    const url = window.location.pathname;
    return url.match(regex);
};

export const hentFodselsnummerFraURL = (): string | null => {
    const url = window.location.pathname;
    const match = url.match(regex);
    if (match && match.length === 2) {
        return match[1];
    }
    return null;
};

interface PersonsokEvent extends Event {
    fodselsnummer?: Fnr;
}

let forrigeFodselsnummer: Fnr;
export const sendEventOmPersonFraURL = (): void => {
    if (personErSattIURL()) {
        const fodselsnummer = hentFodselsnummerFraURL();
        if (fodselsnummer !== forrigeFodselsnummer) {
            forrigeFodselsnummer = fodselsnummer;
            const personsokEvent: PersonsokEvent = document.createEvent('Event');
            personsokEvent.initEvent('flate-person-endret', true, true);
            personsokEvent.fodselsnummer = fodselsnummer;
            document.dispatchEvent(personsokEvent);
        }
    }
};

export const initialiserEventhandtering = (): void => {
    window.onload = sendEventOmPersonFraURL;
    window.onpopstate = sendEventOmPersonFraURL;

    document.addEventListener('dekorator-hode-personsok', (event: PersonsokEvent) => {
        settPersonIURL(event.fodselsnummer);
        sendEventOmPersonFraURL();
    });
};
