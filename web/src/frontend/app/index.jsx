import React from 'react';
import { render } from 'react-dom';

import Personoversikt from 'Personoversikt'; // eslint-disable-line
import { initialiserEventhandtering } from './eventhandtering';

document.addEventListener('DOMContentLoaded', () => {

    const hodeMeny = document.getElementById('js-dekorator-nav');
    const veilarbpersonflatefsMeny = document.getElementById('veilarbpersonflatefs-meny');
    const hodeMenyKnapp = document.getElementById('js-dekorator-toggle-meny');
    hodeMenyKnapp.addEventListener('click', () => {
        hodeMeny.innerHTML = veilarbpersonflatefsMeny.innerHTML;
    });
    render(<Personoversikt />
        , document.getElementById('app'));
});

initialiserEventhandtering();
