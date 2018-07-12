import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormattedMessage, IntlProvider } from 'react-intl';
import './index.less';

import { hentFodselsnummerFraURL, initialiserEventhandtering } from './eventhandtering';
import { initialiserToppmeny } from './utils/dekorator-utils';
import EnhetContext from './context/context';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { tekster } from './context/context-tekster';
import NAVSPA from "./NAVSPA";
import {enhetFraUrl} from "./utils/url-utils";

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

interface AppProps {
    fnr: string;
    enhet?: string;
}

function renderApp(AppComponent, elementId: string, appNavn: string, props?: AppProps) {
    const element = document.getElementById(elementId);
    try {
        ReactDOM.render(<AppComponent {...props} />, element);
    } catch (e) {
        ReactDOM.render(<Feil appNavn={appNavn} />, element);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const fnr = hentFodselsnummerFraURL();
    if (!(window as any).renderDecoratorHead) {
        visFeilmelding();
    } else if (!fnr) {
        initialiserToppmeny();
        ReactDOM.render(<FeilmeldingManglerFnr />, document.getElementById('context'));
    } else {
        initialiserToppmeny();
        ReactDOM.render(<EnhetContext />, document.getElementById('context'));
    }
});

document.addEventListener('flate-person-endret', () => {
    const appProps = {
        fnr: hentFodselsnummerFraURL(),
        enhet: enhetFraUrl()
    };

    const Mao: React.ComponentType<AppProps> = NAVSPA.importer<AppProps>('veilarbmaofs');
    renderApp(Mao, 'mao-app', 'veilarbmaofs', appProps);

    const Aktivitetsplan: React.ComponentType<AppProps> = NAVSPA.importer<AppProps>('aktivitetsplan');
    renderApp(Aktivitetsplan, 'aktivitetsplan-app', 'aktivitetsplan', appProps);
});

initialiserEventhandtering();
