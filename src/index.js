import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { matchPattern } from 'react-router/lib/PatternUtils';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';

import App from './App';
import Login from './components/Login';
import Logout from './components/Logout';

import { TOKEN_KEY } from './logicas/LogicaLogin';

import './css/reset.css';
import './css/timeline.css';
import './css/login.css';

import { timeline } from './reducers/timeline';
import { notificacao } from './reducers/header';

import registerServiceWorker from './registerServiceWorker';

const store = createStore(combineReducers({ timeline, notificacao }), applyMiddleware(thunkMiddleware));

function verificaAutenticacao(nextState, replace) {
    const resultado = matchPattern('/timeline(/:login)', nextState.location.pathname);
    const enderecoPrivadoTimeline = resultado.paramValues[0] === undefined;

    if (enderecoPrivadoTimeline && localStorage.getItem(TOKEN_KEY) === null) {
        const mensagem = 'Você precisa estar logado para acessar este endereço';
        replace(`/?mensagem=${mensagem}`);
    }
}

ReactDOM.render(
    (
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={Login} />
                <Route path="/timeline(/:login)" component={App} onEnter={verificaAutenticacao} />
                <Route path="/logout" component={Logout} />
            </Router>
        </Provider>
    ),
    document.getElementById('root')
);
registerServiceWorker();
