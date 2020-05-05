import { AppState, UserSettingsState, getDefaultAppState, getDefaultUserSettingsState } from 'state/State'
import { logError } from 'core/logging/logger'
import lodash from 'lodash'
import { toast } from 'react-toastify'
import { prettyPrintBytes } from 'core/converters/string'

const persistAppState = (appstate: AppState) => {
    persist('keyrier-json.app.state', appstate)
}

const persistUserSettings = (userSettings: UserSettingsState) => {
    persist('keyrier-json.user.settings', userSettings)
}

const getUserSettings = () => load('keyrier-json.user.settings') as UserSettingsState
const getAppState = () => load('keyrier-json.app.state') as AppState

type StorageKey = 'keyrier-json.app.state' | 'keyrier-json.user.settings'

const persist = (key: StorageKey, value: object | undefined) => {
    console.log({ key })
    const storage = getStorage()
    if (!storage) {
        toast.warn("Browser does'nt support required storage")
        return
    }
    const toBeSaved = JSON.stringify(value)
    try {
        storage.setItem(key, toBeSaved)
    } catch (error) {
        toast.warn(`Error while saving ${key} to storage. size: ${prettyPrintBytes(toBeSaved.length)}`)
    }
}

const loadFromStorage = (key: StorageKey) => {
    const storage = getStorage()
    if (storage) {
        return storage.getItem(key)
    }
    return null
}

const getDefault = (key: StorageKey) => {
    switch (key) {
        case 'keyrier-json.app.state':
            return getDefaultAppState()
        case 'keyrier-json.user.settings':
            return getDefaultUserSettingsState()
        default:
            throw new Error(`no defaul value for ${key}`)
    }
}

const load = (key: StorageKey) => {
    let state = getDefault(key)
    try {
        const savedStateString = loadFromStorage(key)
        if (savedStateString) {
            state = JSON.parse(savedStateString)
            state = lodash.merge({}, state)
        }
    } catch (error) {
        logError(error)
    }

    return state
}

const getStorage = () => {
    if (window.localStorage) {
        return window.localStorage
    }
    if (window.sessionStorage) {
        return window.sessionStorage
    }
    return null
}

export default {
    getAppState,
    getUserSettings,
    persistAppState,
    persistUserSettings,
}
