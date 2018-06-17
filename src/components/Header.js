import React, { Component } from 'react';
import { Link } from 'react-router';

import TimelineApi from '../logicas/TimelineApi';

export default class Header extends Component {

    constructor() {
        super();

        this.state = { mensagem : '' };
    }

    componentDidMount() {
        this.props.store.subscribe((() => this.setState({ mensagem : this.props.store.getState().notificacao })));
    }

    pesquisa(event) {
        event.preventDefault();

        const loginPesquisado = this.inputPesquisa.value;
        this.props.store.dispatch(TimelineApi.carregaFotos(loginPesquisado));
    }

    render() {
        return (
            <header className="header container">
                <h1 className="header-logo">
                    Instalura
                </h1>

                <form className="header-busca" onSubmit={this.pesquisa.bind(this)}>
                    <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.inputPesquisa = input} />
                    <input type="submit" value="Buscar" className="header-busca-submit"/>
                </form>

                <nav>
                    <ul className="header-nav">
                        <li className="header-nav-item">
                            <span>{this.state.mensagem}</span>
                            <Link>
                                ♡
                                {/*                 ♥ */}
                                {/* Quem deu like nas minhas fotos */}
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}