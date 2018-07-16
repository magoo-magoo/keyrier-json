import { createStore } from 'redux';
import rootReducers from './Reducers';
const store = createStore(rootReducers);

export default store;