import React from 'react';
import { render } from 'react-dom';

import Personoversikt from 'Personoversikt';

document.addEventListener('DOMContentLoaded', () => {
    render(<Personoversikt />
        , document.getElementById('app'));
});
