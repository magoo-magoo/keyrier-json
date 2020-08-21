import { configureStore as conf, getDefaultMiddleware } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'

import rootReducers from '../reducers/reducers'
import persistence from './persistence'

export const configureStore = async () => {
    const appState = await persistence.getAppState()
    const userSettingsState = await persistence.getUserSettings()
    const preloadedState = {
        app: {
            past: appState.past ?? [],
            present: appState.present,
            future: appState.future ?? [],
        },
        userSettings: userSettingsState,
    }

    const logger = createLogger({
        predicate: () => process.env.NODE_ENV !== 'test',
        duration: true,
    })
    const middleware = [...getDefaultMiddleware(), logger]

    const store = conf({
        reducer: rootReducers,
        devTools: process.env.NODE_ENV !== 'production',
        preloadedState,
        middleware,
    })

    store.subscribe(() => {
        persistence.persistAppState(store.getState().app)
        persistence.persistUserSettings(store.getState().userSettings)
    })

    return store
}
