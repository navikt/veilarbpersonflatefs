import React from 'react';
import { render } from 'react-dom';

import Personoversikt from 'Personoversikt'; // eslint-disable-line

const BASE_URL = '/veilarbpersonflatefs/';

document.addEventListener('DOMContentLoaded', () => {

    const hodeMeny = document.getElementById('js-dekorator-nav');
    const veilarbpersonflatefsMeny = document.getElementById('veilarbpersonflatefs-meny');
    const hodeMenyKnapp = document.getElementById('js-dekorator-toggle-meny');
    hodeMenyKnapp.addEventListener('click', () => {
        hodeMeny.innerHTML = veilarbpersonflatefsMeny.innerHTML;
    });
    console.log("Hello?");
    render(<Personoversikt />
        , document.getElementById('app'));
});

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
        const personsokEvent = new CustomEvent('flate-person-endret'); // eslint-disable-line no-undef
        personsokEvent.personnummer = hentPersonnummerFraURL();
        document.dispatchEvent(personsokEvent);
    }
};

window.onload = sendEventOmPersonFraURL;
window.onpopstate = sendEventOmPersonFraURL;

document.addEventListener('dekorator-hode-personsok', (event) => {
    settPersonIURL(event.personnummer);
    sendEventOmPersonFraURL();
});
