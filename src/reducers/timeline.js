import {
    TYPE_CARREGA_FOTOS,
    TYPE_COMENTA_FOTO,
    TYPE_LIKE_FOTO
} from '../logicas/TimelineApi';

export function timeline(state = [], action) {
    if (action.type === TYPE_CARREGA_FOTOS) {
        return action.fotos;
    }

    if (action.type === TYPE_COMENTA_FOTO) {
        const fotoAchada = state.find(foto => foto.id === action.fotoId);
        fotoAchada.comentarios.push(action.novoComentario);

        return state;
    }

    if (action.type === TYPE_LIKE_FOTO) {
        const fotoAchada = state.find(foto => foto.id === action.fotoId);
        const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === action.liker.login);

        fotoAchada.likeada = !fotoAchada.likeada;

        if (!possivelLiker) {
            fotoAchada.likers.push(action.liker);
        } else {
            const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== action.liker.login);
            fotoAchada.likers = novosLikers;
        }

        return state;
    }

    return state;
}