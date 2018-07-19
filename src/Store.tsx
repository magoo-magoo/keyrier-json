import { createStore } from 'redux';
import rootReducers from './Reducers';

const store = createStore(rootReducers,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;