import { AppState, UserSettingsState, getInitialAppState } from '../State/State'
import { logError } from '../helpers/logger'
import lodash from 'lodash'

export const persistAppState = (appstate: AppState) => {
  if (window.localStorage) {
    localStorage.setItem('keyrier-json.app.state', JSON.stringify(appstate))
  }
}
export const persistUserSettings = (userSettings: UserSettingsState) => {
  if (window.localStorage) {
    localStorage.setItem('keyrier-json.user.settings', JSON.stringify(userSettings))
  }
}

export const loadAppState = () => {
  return loadFromLocalStorage('keyrier-json.app.state')
}

export const loadUserSettingsState = () => {
  return loadFromLocalStorage('keyrier-json.user.settings')
}

const loadFromLocalStorage = (key: string) => {
  if (window.localStorage) {
    return localStorage.getItem(key)
  }
  return null
}

export const loadOrdCreate = <T extends {}>(key: string, defaultValue: T) => {
  let state = defaultValue
  try {
    const savedStateString = loadFromLocalStorage(key)
    if (savedStateString) {
      state = JSON.parse(savedStateString)
      state = lodash.merge({}, getInitialAppState(), state)
    }
  } catch (error) {
    logError(error)
  }
  return state
}