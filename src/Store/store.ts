import { createStore, compose } from 'redux';
import rootReducers from '../Reducers/reducers';
import {
  getInitialAppState,
  getInitialUserSettingsState,
} from '../State/State';
import {
  loadOrdCreate,
  persistAppState,
  persistUserSettings,
} from './persistence';

export const configureStore = async () => {
  let AppState = await loadOrdCreate(
    'keyrier-json.app.state',
    getInitialAppState()
  );
  let UserSettingsState = await loadOrdCreate(
    'keyrier-json.user.settings',
    getInitialUserSettingsState()
  );

  const composeEnhancers =
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const store = createStore(
    rootReducers,
    { app: AppState, userSettings: UserSettingsState },
    composeEnhancers()
  );

  store.subscribe(() => {
    persistAppState(store.getState().app);
    persistUserSettings(store.getState().userSettings);
  });

  return store;
};
