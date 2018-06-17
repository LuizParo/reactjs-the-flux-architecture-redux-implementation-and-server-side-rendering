import {
    TYPE_NOTIFICA
} from '../actions/actionCreator';

export function notificacao(state = '', action) {
    if (action.type === TYPE_NOTIFICA) {
        return action.mensagem;
    }

    return state;
}