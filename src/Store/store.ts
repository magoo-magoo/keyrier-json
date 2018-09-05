import { createStore, compose } from "redux";
import rootReducers from "../Reducers/reducers";
import { RootState, getInitialState } from "../State/State";
import { logError } from "../helpers/logger";

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

export const configureStore = async () => {
  const lodashModule = await import(/* webpackChunkName: "lodash" */ "lodash");
  let preloadState = getInitialState();

  try {
    const savedStateString = loadStore();
    if (savedStateString) {
      preloadState = JSON.parse(savedStateString);
      const merge = lodashModule.merge;
      preloadState = merge({}, getInitialState(), preloadState);
    }
  } catch (error) {
    logError(error);
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

  return store;
};
