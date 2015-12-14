import merge from 'lodash/object/merge';
import explorer from './explorer';
import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  explorer,
  router,
});

export default rootReducer;
