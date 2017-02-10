import React from 'react';
import { render } from 'react-dom';

import Personoversikt from 'Personoversikt'; // eslint-disable-line
import { initialiserEventhandtering } from './eventhandtering';

document.addEventListener('DOMContentLoaded', () => {
    render(<Personoversikt />
        , document.getElementById('app'));
});

initialiserEventhandtering();
