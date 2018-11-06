import { createStore, compose } from 'redux';
import rootReducers from '../Reducers/reducers';
import {
  AppState,
  getInitialAppState,
  UserSettingsState,
  getInitialUserSettingsState,
} from '../State/State';
import { logError } from '../helpers/logger';
import { LoDashStatic } from 'lodash';

const persistAppState = (appstate: AppState | {}) => {
  if (window.localStorage) {
    localStorage.setItem('keyrier-json.app.state', JSON.stringify(appstate));
  }
};
const persistUserSettings = (userSettings: UserSettingsState | {}) => {
  if (window.localStorage) {
    localStorage.setItem(
      'keyrier-json.user.settings',
      JSON.stringify(userSettings)
    );
  }
};

const loadAppState = () => {
  if (window.localStorage) {
    return localStorage.getItem('keyrier-json.app.state');
  }
  return null;
};
const loadUserSettingsState = () => {
  if (window.localStorage) {
    return localStorage.getItem('keyrier-json.user.settings');
  }
  return null;
};

const loader = <T extends {}>(
  getInitialStateFunc: () => T,
  loadAppState: () => string | null,
  lodashModule: LoDashStatic
) => {
  let state = getInitialStateFunc();
  try {
    const savedStateString = loadAppState();
    if (savedStateString) {
      state = JSON.parse(savedStateString);
      const merge = lodashModule.merge;
      state = merge({}, getInitialAppState(), state);
    }
  } catch (error) {
    logError(error);
  }
  return state;
};

export const configureStore = async () => {
  const lodashModule = await import(/* webpackChunkName: "lodash" */ 'lodash');
  let AppState = loader(getInitialAppState, loadAppState, lodashModule.default);
  let UserSettingsState = loader(
    getInitialUserSettingsState,
    loadUserSettingsState,
    lodashModule.default
  );

  const composeEnhancers =
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const enhancer = composeEnhancers();

  const store = createStore(
    rootReducers,
    { app: AppState, userSettings: UserSettingsState },
    enhancer
  );

  store.subscribe(() => {
    persistAppState(store.getState().app);
    persistUserSettings(store.getState().userSettings);
  });

  return store;
};
