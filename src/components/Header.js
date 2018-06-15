import React, { Component } from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';

import { TOPIC_TIMELINE } from './Timeline';

export default class Header extends Component {

    pesquisa(event) {
        event.preventDefault();

        const loginPesquisado = this.inputPesquisa.value;
        fetch(`http://localhost:8080/api/public/fotos/${loginPesquisado}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error('Não foi possível pesquisar usuário');
            })
            .then(fotos => PubSub.publish(TOPIC_TIMELINE, fotos));
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