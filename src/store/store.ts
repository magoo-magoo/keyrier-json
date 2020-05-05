import { createStore, compose } from 'redux'
import rootReducers from 'reducers/reducers'
import persistence from './persistence'

export const configureStore = () => {
    const appState = persistence.getAppState()
    const userSettingsState = persistence.getUserSettings()

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
            },
            userSettings: userSettingsState,
        },
        composeEnhancers()
    )

    store.subscribe(() => {
        persistence.persistAppState(store.getState().app.present)
        persistence.persistUserSettings(store.getState().userSettings)
    })

    return store
}
