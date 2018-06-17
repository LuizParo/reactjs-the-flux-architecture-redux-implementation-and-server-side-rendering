import React, { Component } from 'react';

import FotoItem from './FotoItem';

import TimelineApi from '../logicas/TimelineApi';

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
        this.props.store.subscribe(() => this.setState({ fotos : this.props.store.getState().timeline }));
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
        this.props.store.dispatch(TimelineApi.carregaFotos(login));
    }

    like(fotoId) {
        this.props.store.dispatch(TimelineApi.like(fotoId));
    }

    comenta(fotoId, comentario) {
        this.props.store.dispatch(TimelineApi.comenta(fotoId, comentario));
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