import React, { Component } from 'react';
import { connect } from 'react-redux';

import FotoItem from './FotoItem';

import TimelineApi from '../logicas/TimelineApi';

class Timeline extends Component {

    constructor() {
        super();
        this.login = '';
    }

    componentDidMount() {
        this.props.carregaFotos(this.props.login);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== this.login) {
            this.login = nextProps.login;
            this.props.carregaFotos(nextProps.login);
        }
    }

    render() {
        return (
            <div className="fotos container">
                {
                    this.props.fotos.map(foto => <FotoItem foto={foto} key={foto.id} like={this.props.like} comenta={this.props.comenta} />)
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        fotos : state.timeline
    };
}

function mapDispatchToProps(dispatch) {
    return {
        like : fotoId => dispatch(TimelineApi.like(fotoId)),
        comenta : (fotoId, comentario) => dispatch(TimelineApi.comenta(fotoId, comentario)),
        carregaFotos : login => dispatch(TimelineApi.carregaFotos(login))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);