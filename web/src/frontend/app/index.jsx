import React from 'react';
import { render } from 'react-dom';

import './index.less';

import Personoversikt from 'Personoversikt'; // eslint-disable-line
import { initialiserEventhandtering } from './eventhandtering';
import { initialiserToppmeny } from './utils/meny-utils';

const visFeilmelding = () => {
    window.location = '/veilarbpersonflatefs/static/feilside.html';
};

document.addEventListener('DOMContentLoaded', () => {
    if (!window.renderDecoratorHead) {
        visFeilmelding();
    } else {
        initialiserToppmeny();
        render(<Personoversikt />
            , document.getElementById('app'));
    }
});

initialiserEventhandtering();
