import { combineReducers } from "redux";

import { notificacao } from './header';
import { timeline } from './timeline';

export default combineReducers({
  notificacao,
  timeline
});
