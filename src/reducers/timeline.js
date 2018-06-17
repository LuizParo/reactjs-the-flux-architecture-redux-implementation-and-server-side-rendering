import { List } from 'immutable';

import {
    TYPE_CARREGA_FOTOS,
    TYPE_COMENTA_FOTO,
    TYPE_LIKE_FOTO
} from '../actions/actionCreator';

function trocaFoto(state, fotoId, callbackNovasPropriedades) {
    const fotoAtual = state.find(foto => foto.id === fotoId);

    const novasPropriedades = callbackNovasPropriedades(fotoAtual);
    const fotoAtualizada = Object.assign({}, fotoAtual, novasPropriedades);
    const indiceDaFotoAtual = state.findIndex(foto => foto.id === fotoAtual.id);
    
    return state.set(indiceDaFotoAtual, fotoAtualizada);
}

export function timeline(state = new List(), action) {
    if (action.type === TYPE_CARREGA_FOTOS) {
        return new List(action.fotos);
    }

    if (action.type === TYPE_COMENTA_FOTO) {
        return trocaFoto(state, action.fotoId, fotoAtual => {
            const novosComentarios = fotoAtual.comentarios.concat(action.novoComentario);
            return { comentarios : novosComentarios }
        });
    }

    if (action.type === TYPE_LIKE_FOTO) {
        return trocaFoto(state, action.fotoId, fotoAtual => {
            const possivelLiker = fotoAtual.likers.find(likerAtual => likerAtual.login === action.liker.login);

            let novosLikers = [];
            if (!possivelLiker) {
                novosLikers = fotoAtual.likers.concat(action.liker);
            } else {
                novosLikers = fotoAtual.likers.filter(likerAtual => likerAtual.login !== action.liker.login);
            }

            return { likers : novosLikers, likeada : !fotoAtual.likeada }
        });
    }

    return state;
}