import PubSub from 'pubsub-js';

import { TOKEN_KEY } from './LogicaLogin';

export const TOPIC_ATUALIZA_LIKER = 'atualiza-liker';
export const TOPIC_TIMELINE = 'timeline';
export const TOPIC_NOVOS_COMENTARIOS = 'novos-comentarios';

export default class LogicaTimeline {

    constructor(fotos) {
        this.fotos = fotos;
    }

    carregaFotos(urlPerfil) {
        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                this.fotos = fotos;
                PubSub.publish(TOPIC_TIMELINE, fotos);
            });
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
            .then(novoComentario => {
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
                fotoAchada.comentarios.push(novoComentario);

                PubSub.publish(TOPIC_TIMELINE, this.fotos);
            });
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
            .then(liker => {
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
                const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);
    
                fotoAchada.likeada = !fotoAchada.likeada;
    
                if (!possivelLiker) {
                    fotoAchada.likers.push(liker);
                } else {
                    const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
                    fotoAchada.likers = novosLikers;
                }

                PubSub.publish(TOPIC_TIMELINE, this.fotos);
            });
    }

    subscribe(callback) {
        PubSub.subscribe(TOPIC_TIMELINE, (topic, fotos) => callback(fotos));
    }
}