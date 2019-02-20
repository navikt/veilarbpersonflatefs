import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import { settPersonIURL } from './utils/url-utils';
import getWindow from './utils/window';
import './index.less';

if (!getWindow()._babelPolyfill) {
    // @ts-ignore
    require('babel-polyfill');
}

document.addEventListener(
    'dekorator-hode-personsok',
    (event: any) => {
        settPersonIURL(event.fodselsnummer);
    }
);

ReactDOM.render(<App />, document.getElementById('pagewrapper'));
