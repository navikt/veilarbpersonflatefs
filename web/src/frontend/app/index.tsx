import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.less';

import Personoversikt from 'Personoversikt';
import Aktivitetsplan from 'Aktivitetsplan';
import { initialiserEventhandtering } from './eventhandtering';
import { initialiserToppmeny } from './utils/dekorator-utils';
import EnhetContext from './context/enhet-context';

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
        ReactDOM.render(<AppComponent />, element);
    } catch (e) {
        ReactDOM.render(<Feil appNavn={appNavn} />, element);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!(window as any).renderDecoratorHead) {
        visFeilmelding();
    } else {
        initialiserToppmeny();
        ReactDOM.render(<EnhetContext />, document.getElementById('context'));
        renderApp(Personoversikt, 'app', 'personoversikt');
        renderApp(Aktivitetsplan, 'aktivitetsplan-app', 'aktivitetsplan');
    }
});

initialiserEventhandtering();
