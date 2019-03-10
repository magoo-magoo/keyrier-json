import { createStore, compose } from 'redux'
import rootReducers from '../Reducers/reducers'
import { AppState, UserSettingsState } from '../State/State'
import { load, persistAppState, persistUserSettings } from './persistence'

export const configureStore = () => {
  const appState = load<AppState>('keyrier-json.app.state')
  const userSettingsState = load<UserSettingsState>('keyrier-json.user.settings')

  const composeEnhancers =
    typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose

  const store = createStore(rootReducers, { app: appState, userSettings: userSettingsState }, composeEnhancers())

  store.subscribe(() => {
    persistAppState(store.getState().app)
    persistUserSettings(store.getState().userSettings)
  })

  return store
}
