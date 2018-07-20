import { createStore } from "redux";
import rootReducers from "./Reducers";
import { initialState, IRootState } from "./State";

const persistStore = (rootState: IRootState) =>
  localStorage.setItem("keyrier-json.app.state", JSON.stringify(rootState));

const loadStore = () => localStorage.getItem("keyrier-json.app.state");

const savedStateString = loadStore();
let preloadState = initialState;
if (savedStateString) {
  preloadState = JSON.parse(savedStateString);
}

const store = createStore(
  rootReducers,
  { rootReducer: preloadState },
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  persistStore(store.getState().rootReducer);
});

export default store;
