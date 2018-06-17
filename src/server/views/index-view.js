//
// This is the server side entry point for the React app.
//

import ReduxRouterEngine from "electrode-redux-router-engine";
import thunkMiddleware from 'redux-thunk';

import { routes } from "../../client/routes";
import { createStore,  applyMiddleware } from "redux";
import rootReducer from "../../client/reducers";

import { TOKEN_KEY } from "../../client/logicas/LogicaLogin";
import TimelineApi from "../../client/logicas/TimelineApi";

function createReduxStore(req, match) { // eslint-disable-line
    const estadoInicial = {
        timeline : [],
        notificacao : ''
    };

    const store = createStore(rootReducer, estadoInicial, applyMiddleware(thunkMiddleware));
    const promise = store.dispatch(TimelineApi.carregaFotos('', req.state[TOKEN_KEY]));
    return promise.then(() => store);
}

//
// This function is exported as the content for the webapp plugin.
//
// See config/default.json under plugins.webapp on specifying the content.
//
// When the Web server hits the routes handler installed by the webapp plugin, it
// will call this function to retrieve the content for SSR if it's enabled.
//
//

module.exports = (req) => {
    const app = req.server && req.server.app || req.app;
    if (!app.routesEngine) {
        app.routesEngine = new ReduxRouterEngine({routes, createReduxStore});
    }

    return app.routesEngine.render(req);
};
