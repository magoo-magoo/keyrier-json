import { createStore, applyMiddleware, compose } from "redux";
import rootReducers, { crashReporter } from "../Reducers/reducers";
import { initialState, RootState } from "../State/State";
import { mergeWith } from "lodash";

const persistStore = (rootState: RootState) => {
  if (window.localStorage) {
    localStorage.setItem("keyrier-json.app.state", JSON.stringify(rootState));
  }
};

const loadStore = () => {
  if (window.localStorage !== undefined) {
    return localStorage.getItem("keyrier-json.app.state");
  }
  return null;
};

let preloadState = initialState;

const customizer = (
  value: any,
  srcValue: any,
  key: string,
  object: any,
  source: any
) => {
  if (Array.isArray(value)) {
    return srcValue;
  }
  return undefined;
};

try {
  const savedStateString = loadStore();
  if (savedStateString) {
    preloadState = JSON.parse(savedStateString);
  }
  preloadState = mergeWith(initialState, preloadState, customizer);
} catch (error) {
  // tslint:disable-next-line:no-console
  console.error("State Load", error);
}

const composeEnhancers =
  typeof window === "object" &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers();

const store = createStore(
  rootReducers,
  { rootReducer: preloadState },
  enhancer
);

store.subscribe(() => {
  persistStore(store.getState().rootReducer);
});

export default store;
