import rootReducers from 'reducers/reducers'
import { compose, createStore } from 'redux'
import persistence from './persistence'

export const configureStore = async () => {
    const appState = await persistence.getAppState()
    const userSettingsState = await persistence.getUserSettings()

    const composeEnhancers =
        typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
            : compose

    const store = createStore(
        rootReducers,
        {
            app: {
                past: appState.past ?? [],
                present: appState.present,
                future: appState.future ?? [],
            },
            userSettings: userSettingsState,
        },
        composeEnhancers()
    )

    store.subscribe(() => {
        persistence.persistAppState(store.getState().app)
        persistence.persistUserSettings(store.getState().userSettings)
    })

    return store
}
