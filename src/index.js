import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import store from './store';
import Game from './components/Game';

// ========================================

window.store = store;

ReactDOM.render(
    <Provider store = { store }>
        <Game />
    </Provider>,
    document.getElementById('root')
);
