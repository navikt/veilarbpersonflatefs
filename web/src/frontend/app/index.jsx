import React from 'react';
import { render } from 'react-dom';

import './index.less';

import Personoversikt from 'Personoversikt'; // eslint-disable-line
import { initialiserEventhandtering } from './eventhandtering';
import { lagHtmlMeny } from './meny-utils';

const visFeilmelding = () => {
    window.location = '/veilarbpersonflatefs/static/feilside.html';
};

document.addEventListener('DOMContentLoaded', () => {
    if (!document.internarbeidsflatedecoratorErLastet) {
        visFeilmelding();
    } else {
        const hodeMeny = document.getElementById('js-dekorator-nav');
        const hodeMenyKnapp = document.getElementById('js-dekorator-toggle-meny');
        hodeMenyKnapp.addEventListener('click', () => {
            hodeMeny.innerHTML = lagHtmlMeny();
        });

        render(<Personoversikt />
            , document.getElementById('app'));
    }
});

initialiserEventhandtering();
