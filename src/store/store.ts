import { createStore, compose } from 'redux'
import rootReducers from 'reducers/reducers'
import { persistAppState, persistUserSettings, getAppState, getUserSettings } from './persistence'

export const configureStore = () => {
  const appState = getAppState()
  const userSettingsState = getUserSettings()

  const composeEnhancers =
    typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose

  const store = createStore(
    rootReducers,
    {
      app: {
        past: [],
        present: appState,
        future: [],
        _latestUnfiltered: appState,
        group: undefined,
        index: undefined,
        limit: undefined,
      },
      userSettings: userSettingsState,
    },
    composeEnhancers()
  )

  store.subscribe(() => {
    persistAppState(store.getState().app.present)
    persistUserSettings(store.getState().userSettings)
  })

  return store
}
