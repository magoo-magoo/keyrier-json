import { configuration } from 'config'
import { logError } from 'core/logging/logger'
import localForage from 'localforage'
import { merge } from 'lodash-es'
import { toast } from 'react-toastify'
import { StateWithHistory } from 'redux-undo'
import { AppState, getDefaultAppState, getDefaultUserSettingsState, UserSettingsState } from 'state/State'

const persistAppState = (appstate: StateWithHistory<AppState>) => {
    persist(configuration.storageKey.appState, appstate)
}

const persistUserSettings = (userSettings: UserSettingsState) => {
    persist(configuration.storageKey.userSettings, userSettings)
}

const getUserSettings = () => loadUserSettings(configuration.storageKey.userSettings) as Promise<UserSettingsState>
const getAppState = () => loadAppState(configuration.storageKey.appState) as Promise<StateWithHistory<AppState>>

const persist = async (key: string, value: object | undefined) => {
    try {
        await localForage.setItem(key, value)
    } catch (error) {
        toast.warn(`Error while saving ${key} to storage. ${error}`)
    }
}

const getDefault = (key: string) => {
    switch (key) {
        case configuration.storageKey.appState:
            return getDefaultAppState()
        case configuration.storageKey.userSettings:
            return getDefaultUserSettingsState()
        default:
            throw new Error(`no defaul value for ${key}`)
    }
}

const loadAppState = async (key: string) => {
    let present = merge({}, getDefault(key))
    try {
        const savedState = await localForage.getItem<StateWithHistory<AppState>>(key)
        return merge({ present }, savedState ?? {})
    } catch (error) {
        logError(error)
    }

    return {}
}
const loadUserSettings = async (key: string) => {
    let state = getDefault(key)
    try {
        const savedState = await localForage.getItem<UserSettingsState>(key)
        return merge(state, savedState ?? {})
    } catch (error) {
        logError(error)
    }

    return {}
}

export default {
    getAppState,
    getUserSettings,
    persistAppState,
    persistUserSettings,
}
