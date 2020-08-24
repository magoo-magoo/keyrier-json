import { configuration } from 'config'
import { logError } from 'core/logging/logger'
import localForage from 'localforage'
import { merge } from 'lodash-es'
import { toast } from 'react-toastify'
import { StateWithHistory } from 'redux-undo'
import { AppState, getDefaultAppState, getDefaultUserSettingsState, UserSettingsState } from 'state/State'

const persistAppState = (appstate: StateWithHistory<AppState>): void => {
    void persist(configuration.storageKey.appState, appstate)
}

const persistUserSettings = (userSettings: UserSettingsState): void => {
    void persist(configuration.storageKey.userSettings, userSettings)
}

const getUserSettings = (): Promise<UserSettingsState> => loadUserSettings(configuration.storageKey.userSettings)
const getAppState = (): Promise<StateWithHistory<AppState>> => loadAppState(configuration.storageKey.appState)

const persist = async (key: string, value: StateWithHistory<AppState> | UserSettingsState | undefined) => {
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

const loadAppState = async (key: string): Promise<StateWithHistory<AppState>> => {
    const present = merge({}, getDefault(key))
    try {
        const savedState = (await localForage.getItem<any>(key)) ?? {}
        return merge({ present }, savedState ?? {})
    } catch (error) {
        logError(error)
    }

    return { future: [], past: [], present: {} }
}
const loadUserSettings = async (key: string) => {
    const state = getDefault(key)
    try {
        const savedState = await localForage.getItem<UserSettingsState>(key)
        return merge(state, savedState ?? {})
    } catch (error) {
        logError(error)
    }

    return {}
}

const persistence = {
    getAppState,
    getUserSettings,
    persistAppState,
    persistUserSettings,
}

export default persistence
