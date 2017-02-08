import React from 'react';
import { render } from 'react-dom';

import Personoversikt from 'Personoversikt';

const BASE_URL = '/veilarbpersonflatefs/';

document.addEventListener('DOMContentLoaded', () => {
    render(<Personoversikt />
        , document.getElementById('app'));
});

const settPersonIURL = (personnummer) => {
    window.history.pushState(`Endret personnummer til ${personnummer}`, "", `${BASE_URL}${personnummer}`)
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
    if (match.length == 2) {
        return match[1];
    }
    return null;
};

document.addEventListener('dekorator-hode-personsok', (event) => {
    settPersonIURL(event.personnummer);
});

const sendEventOmPersonFraURL = () => {
    if (personErSattIURL()) {
        let personsokEvent = new Event('dekorator-hode-personsok');
        personsokEvent.personnummer = hentPersonnummerFraURL();
        document.dispatchEvent(personsokEvent);
    }
};

window.onload = sendEventOmPersonFraURL;
window.onpopstate = sendEventOmPersonFraURL;
