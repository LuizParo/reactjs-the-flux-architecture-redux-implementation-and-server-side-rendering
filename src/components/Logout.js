import { Component } from 'react';
import { browserHistory } from 'react-router';

import { TOKEN_KEY } from './Login';

export default class Logout extends Component {

    componentWillMount() {
        localStorage.removeItem(TOKEN_KEY);
        browserHistory.push('/');
    }

    render() {
        return null;
    }
}