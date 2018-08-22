import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import './index.less';
import { settPersonIURL } from './utils/url-utils';

// tslint:disable
if (!(global as any)._babelPolyfill) {
    require('babel-polyfill');
}
// tslint:enable

interface PersonsokEvent extends Event {
    fodselsnummer: string;
}

document.addEventListener(
    'dekorator-hode-personsok',
    (event: PersonsokEvent) => {
        settPersonIURL(event.fodselsnummer);
    }
);

ReactDOM.render(<App />, document.getElementById('pagewrapper'));
