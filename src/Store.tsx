import { createStore } from "redux";
import rootReducers from "./Reducers";
import { initialState } from "./State";

const savedStateString = localStorage.getItem("keyrier-json.app.state");
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
  localStorage.setItem(
    "keyrier-json.app.state",
    JSON.stringify(store.getState().rootReducer)
  );
});

export default store;
