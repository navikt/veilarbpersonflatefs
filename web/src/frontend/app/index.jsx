import React from 'react';
import { render } from 'react-dom';

import './index.less';

import Personoversikt from 'Personoversikt'; // eslint-disable-line
import Aktivitetsplan from 'Aktivitetsplan'; // eslint-disable-line
import { initialiserEventhandtering } from './eventhandtering';
import { initialiserToppmeny } from './utils/meny-utils';

const visFeilmelding = () => {
    window.location = '/veilarbpersonflatefs/static/feilside.html';
};


function Feil({ appNavn }) {
    return (
        <div className="applikasjonsfeil">Feil i {appNavn}</div>
    );
}

function renderApp(AppComponent, elementId, appNavn) {
    const element = document.getElementById(elementId);
    try {
        render(<AppComponent />, element);
    } catch (e) {
        console && console.error && console && console.error(e); // eslint-disable-line
        render(<Feil appNavn={appNavn} />, element);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.renderDecoratorHead) {
        visFeilmelding();
    } else {
        initialiserToppmeny();
        renderApp(Personoversikt, 'app', 'personoversikt');
        renderApp(Aktivitetsplan, 'aktivitetsplan-app', 'aktivitetsplan');
    }
});

initialiserEventhandtering();
