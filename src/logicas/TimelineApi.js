import { TOKEN_KEY } from './LogicaLogin';

export const TYPE_CARREGA_FOTOS = 'CARREGA-FOTOS';
export const TYPE_COMENTA_FOTO = 'COMENTA-FOTO';
export const TYPE_LIKE_FOTO = 'LIKE-FOTO';

export default class TimelineApi {

    static carregaFotos(login) {
        return dispatch => {
            let urlPerfil = 'http://localhost:8080/api';
        
            if (!login) {
                const authToken = localStorage.getItem(TOKEN_KEY);
                urlPerfil += `/fotos?X-AUTH-TOKEN=${authToken}`;
            } else {
                urlPerfil += `/public/fotos/${login}`;
            }

            fetch(urlPerfil)
                .then(response => response.json())
                .then(fotos => {
                    dispatch({ type : TYPE_CARREGA_FOTOS, fotos });
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
                    dispatch({
                        type : TYPE_COMENTA_FOTO,
                        fotoId,
                        novoComentario
                    });
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
                    dispatch({
                        type : TYPE_LIKE_FOTO,
                        fotoId,
                        liker
                    });
                    return liker;
                });
        };
    }
}