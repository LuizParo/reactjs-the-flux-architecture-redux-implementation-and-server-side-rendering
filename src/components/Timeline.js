import React, { Component } from 'react';

import FotoItem from './FotoItem';

import { TOKEN_KEY } from '../logicas/LogicaLogin';

export default class Timeline extends Component {

    constructor() {
        super();

        this.state = {
            fotos : []
        };

        this.like = this.like.bind(this);
        this.comenta = this.comenta.bind(this);
    }

    componentWillMount() {
        this.props.store.subscribe(fotos => this.setState({ fotos }));
    }

    componentDidMount() {
        this.carregaFotos(this.props.login);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login) {
            this.carregaFotos(nextProps.login);
        }
    }

    carregaFotos(login) {
        let urlPerfil = 'http://localhost:8080/api';
        
        if (!login) {
            const authToken = localStorage.getItem(TOKEN_KEY);
            urlPerfil += `/fotos?X-AUTH-TOKEN=${authToken}`;
        } else {
            urlPerfil += `/public/fotos/${login}`;
        }
    
        this.props.store.carregaFotos(urlPerfil);
    }

    like(fotoId) {
        this.props.store.like(fotoId);        
    }

    comenta(fotoId, comentario) {
        this.props.store.comenta(fotoId, comentario);
    }

    render() {
        return (
            <div className="fotos container">
                {
                    this.state.fotos.map(foto => <FotoItem foto={foto} key={foto.id} like={this.like} comenta={this.comenta} />)
                }
            </div>
        );
    }
}