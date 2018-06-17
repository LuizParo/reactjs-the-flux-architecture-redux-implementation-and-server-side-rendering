import React, { Component } from 'react';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import Header from './components/Header';
import Timeline from './components/Timeline';

import { timeline } from './reducers/timeline';
import { notificacao } from './reducers/header';

const store = createStore(combineReducers({ timeline, notificacao }), applyMiddleware(thunkMiddleware));

class App extends Component {
    render() {
        return (
            <div id="root">
                <div className="main">
                    <Header store={store} />
                    <Timeline login={this.props.params.login} store={store} />
                </div>
            </div>
        );
    }
}

export default App;
