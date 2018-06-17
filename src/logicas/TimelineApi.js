import { TOKEN_KEY } from './LogicaLogin';

import {
    carrega,
    comenta,
    like,
    notifica
} from '../actions/actionCreator';

export default class TimelineApi {

    static carregaFotos(login) {
        return dispatch => {
            let urlPerfil = 'http://localhost:8080/api';
        
            if (login) {
                urlPerfil += `/public/fotos/${login}`;
            } else {
                const authToken = localStorage.getItem(TOKEN_KEY);
                urlPerfil += `/fotos?X-AUTH-TOKEN=${authToken}`;
            }

            fetch(urlPerfil)
                .then(response => response.json())
                .then(fotos => {
                    if (fotos.length === 0) {
                        dispatch(notifica('Usuário não encontrado'));
                        return [];
                    }
                    
                    dispatch(notifica(''));
                    dispatch(carrega(fotos));
                    return fotos;
                });
        };
    }

    static comenta(fotoId, comentario) {
        return dispatch => {
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
                    dispatch(comenta(fotoId, novoComentario));
                    return novoComentario;
                });
        }
    }

    static like(fotoId) {
        return dispatch => {
            const authToken = localStorage.getItem(TOKEN_KEY);
    
            fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${authToken}`, { method : 'POST' })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
    
                    throw new Error('Não foi possível dar like na foto');
                })
                .then(liker => {
                    dispatch(like(fotoId, liker));
                    return liker;
                });
        };
    }
}