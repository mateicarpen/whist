import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { rootReducer } from './state/reducers';

import './index.css';
import Game from './components/Game';

// ========================================

const store = createStore(rootReducer);

ReactDOM.render(
    <Provider store = { store }>
        <Game />
    </Provider>,
    document.getElementById('root')
);
