import React from 'react';
import { render } from 'react-dom';

document.addEventListener('DOMContentLoaded', () => {
    const hodeMeny = document.getElementById('js-dekorator-nav');
    const veilarbpersonflatefsMeny = document.getElementById('veilarbpersonflatefs-meny');
    const hodeMenyKnapp = document.getElementById('js-dekorator-toggle-meny');
    hodeMenyKnapp.addEventListener('click', () => {
        hodeMeny.innerHTML = veilarbpersonflatefsMeny.innerHTML;
    });
    render((
        <h3>Hallo VeilArbPersonFlateFS!</h3>
    ), document.getElementById('app'));
});
