export const TYPE_CARREGA_FOTOS = 'CARREGA-FOTOS';
export const TYPE_COMENTA_FOTO = 'COMENTA-FOTO';
export const TYPE_LIKE_FOTO = 'LIKE-FOTO';
export const TYPE_NOTIFICA = 'NOTIFICA';

export function carrega(fotos) {
    return { type : TYPE_CARREGA_FOTOS, fotos };
}

export function comenta(fotoId, novoComentario) {
    return {
        type : TYPE_COMENTA_FOTO,
        fotoId,
        novoComentario
    };
}

export function like(fotoId, liker) {
    return {
        type : TYPE_LIKE_FOTO,
        fotoId,
        liker
    };
}

export function notifica(mensagem = '') {
    return {
        type : TYPE_NOTIFICA,
        mensagem
    };
}