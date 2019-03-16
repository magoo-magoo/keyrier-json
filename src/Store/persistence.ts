import { AppState, UserSettingsState, getInitialAppState, getInitialUserSettingsState } from '../State/State'
import { logError } from '../helpers/logger'
import lodash from 'lodash'
import { toast } from 'react-toastify'
import { prettyPrintBytes } from '../helpers/string'

export const persistAppState = (appstate: AppState) => {
  persist('keyrier-json.app.state', appstate)
}

export const persistUserSettings = (userSettings: UserSettingsState) => {
  persist('keyrier-json.user.settings', userSettings)
}

export const getUserSettings = () => load<UserSettingsState>('keyrier-json.user.settings')
export const getAppState = () => load<AppState>('keyrier-json.app.state')

type StorageKey = 'keyrier-json.app.state' | 'keyrier-json.user.settings'

const persist = (key: StorageKey, value: object) => {
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
      return getInitialAppState()
    case 'keyrier-json.user.settings':
      return getInitialUserSettingsState()
    default:
      throw new Error(`no defaul value for ${key}`)
  }
}

const load = <T extends UserSettingsState | AppState>(key: StorageKey) => {
  let state = getDefault(key) as T
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
