import * as React from 'react';
import { render } from 'react-dom';

import './index.less';

import Personoversikt from 'Personoversikt';
import Aktivitetsplan from 'Aktivitetsplan';
import { initialiserEventhandtering } from './eventhandtering';
import { initialiserToppmeny } from './utils/meny-utils';

const visFeilmelding = (): void => {
    (window as any).location = '/veilarbpersonflatefs/static/feilside.html';
};

interface FeilProps {
    appNavn: string;
}

function Feil({ appNavn }: FeilProps) {
    return (
        <div className="applikasjonsfeil">Feil i {appNavn}</div>
    );
}

function renderApp(AppComponent, elementId: string, appNavn: string) {
    const element = document.getElementById(elementId);
    try {
        render(<AppComponent />, element);
    } catch (e) {
        render(<Feil appNavn={appNavn} />, element);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!(window as any).renderDecoratorHead) {
        visFeilmelding();
    } else {
        initialiserToppmeny();
        renderApp(Personoversikt, 'app', 'personoversikt');
        renderApp(Aktivitetsplan, 'aktivitetsplan-app', 'aktivitetsplan');
    }
});

initialiserEventhandtering();
