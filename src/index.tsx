import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { settPersonIURL } from './utils/url-utils';
import getWindow from './utils/window';
import App from './app';
import './index.less';
import { isAppMocked } from './utils/mock-utils';
import AppMock from './app-mock';
import NavFrontendModal from 'nav-frontend-modal';

const window = getWindow();

if (!window._babelPolyfill) {
    // @ts-ignore
    require('babel-polyfill');
}

document.addEventListener(
    'dekorator-hode-personsok',
    (event: any) => {
        settPersonIURL(event.fodselsnummer);
    }
);

NavFrontendModal.setAppElement(document.querySelector('#modal-a11y-wrapper'));

let app;

if (isAppMocked()) {
    app = <AppMock />;
    // @ts-ignore
    require('./mock');
} else {
    app = <App />;
}

ReactDOM.render(app, document.getElementById('pagewrapper'));
