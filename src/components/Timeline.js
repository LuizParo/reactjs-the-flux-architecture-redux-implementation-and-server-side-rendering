import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import FotoItem from './FotoItem';
import { TOKEN_KEY } from './Login';

export const TOPIC_TIMELINE = 'timeline';
export const TOPIC_ATUALIZA_LIKER = 'atualiza-liker';
export const TOPIC_NOVOS_COMENTARIOS = 'novos-comentarios';

export default class Timeline extends Component {

    constructor() {
        super();

        this.state = {
            fotos : []
        };
    }

    carregaFotos(login) {
        let urlPerfil = 'http://localhost:8080/api';
        
        if (!login) {
            const authToken = localStorage.getItem(TOKEN_KEY);
            urlPerfil += `/fotos?X-AUTH-TOKEN=${authToken}`;
        } else {
            urlPerfil += `/public/fotos/${login}`;
        }
    
        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => this.setState({ fotos }));
    }

    componentWillMount() {
        PubSub.subscribe(TOPIC_TIMELINE, (topic, fotos) => this.setState({ fotos }));

        PubSub.subscribe(TOPIC_ATUALIZA_LIKER, (topic, infoLiker) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoLiker.fotoId);
            const possivelLiker = fotoAchada.likers.find(liker => liker.login === infoLiker.liker.login);

            fotoAchada.likeada = !fotoAchada.likeada;

            if (!possivelLiker) {
                fotoAchada.likers.push(infoLiker.liker);
            } else {
                const novosLikers = fotoAchada.likers.filter(liker => liker.login !== infoLiker.liker.login);
                fotoAchada.likers = novosLikers;
            }
            
            this.setState({ fotos : this.state.fotos });
        });
    
        PubSub.subscribe(TOPIC_NOVOS_COMENTARIOS, (topic, infoComentario) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === infoComentario.fotoId);

            fotoAchada.comentarios.push(infoComentario.novoComentario);
            this.setState({ fotos : this.state.fotos });
        });
    }

    componentDidMount() {
        this.carregaFotos(this.props.login);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login) {
            this.carregaFotos(nextProps.login);
        }
    }

    like(fotoId) {
        const authToken = localStorage.getItem(TOKEN_KEY);

        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${authToken}`, { method : 'POST' })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error('Não foi possível dar like na foto');
            })
            .then(liker => PubSub.publish(TOPIC_ATUALIZA_LIKER, { liker, fotoId }));
    }

    comenta(fotoId, comentario) {
        const authToken = localStorage.getItem(TOKEN_KEY);
        const requestInfo = {
            method : 'POST',
            body : JSON.stringify({ texto : comentario }),
            headers : new Headers({
                'Content-Type' : 'application/json'
            })
        };

        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${authToken}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error('Não foi possível comentar foto');
            })
            .then(novoComentario => PubSub.publish(TOPIC_NOVOS_COMENTARIOS, { fotoId, novoComentario }));
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