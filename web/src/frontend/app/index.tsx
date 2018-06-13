import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormattedMessage, IntlProvider } from 'react-intl';
import './index.less';

import Personoversikt from 'Personoversikt';
import Aktivitetsplan from 'Aktivitetsplan';
import { hentFodselsnummerFraURL, initialiserEventhandtering } from './eventhandtering';
import { initialiserToppmeny } from './utils/dekorator-utils';
import EnhetContext from './context/context';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { tekster } from './context/context-tekster';
import NAVSPA from "./NAVSPA";

const visFeilmelding = (): void => {
    (window as any).location = '/veilarbpersonflatefs/static/feilside.html';
};

function FeilmeldingManglerFnr() {
    return <IntlProvider locale="nb" defaultLocale="nb" messages={tekster}>
        <div className="container hovedinnhold">
            <AlertStripeInfoSolid>
                <FormattedMessage {...tekster.manglerFnr} />
            </AlertStripeInfoSolid>
        </div>
    </IntlProvider>;
}

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

interface MaoProps {
    fnr: string;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!(window as any).renderDecoratorHead) {
        visFeilmelding();
    } else if (!hentFodselsnummerFraURL()) {
        initialiserToppmeny();
        ReactDOM.render(<EnhetContext />, document.getElementById('context'));
        ReactDOM.render(<FeilmeldingManglerFnr />, document.getElementById('context'));
    } else {
        initialiserToppmeny();
        ReactDOM.render(<EnhetContext />, document.getElementById('context'));

        const Mao: React.ComponentType<MaoProps> = NAVSPA.importer<MaoProps>('veilarbmaofs');

        renderApp(Personoversikt, 'app', 'personoversikt');
        renderApp(Mao, 'mao-app', 'veilarbmaofs');
        renderApp(Aktivitetsplan, 'aktivitetsplan-app', 'aktivitetsplan');
    }
});

initialiserEventhandtering();
