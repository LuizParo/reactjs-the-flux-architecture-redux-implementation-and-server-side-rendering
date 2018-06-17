import React from "react";
import { Route, IndexRoute } from "react-router";
import {matchPattern} from 'react-router/lib/PatternUtils';

import Home from './components/home';
import Login from './components/Login';
import Logout from './components/Logout';

import { TOKEN_KEY } from './logicas/LogicaLogin';

function verificaAutenticacao(nextState, replace) {
    const navegador = typeof window !== 'undefined';

    if (navegador) {
        const resultado = matchPattern('/timeline(/:login)', nextState.location.pathname);
        const enderecoPrivadoTimeline = resultado.paramValues[0] === undefined;
    
        if (enderecoPrivadoTimeline && localStorage.getItem(TOKEN_KEY) === null) {
            const mensagem = 'Você precisa estar logado para acessar este endereço';
            replace(`/?mensagem=${mensagem}`);
        }
    }
}

export const routes = (
    <Route path="/">
        <IndexRoute component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/timeline(/:login)" component={Home} onEnter={verificaAutenticacao} />
    </Route>
);