import { configureStore } from './store'
import { UserSettingsState, AppState } from 'state/State'

let mockPersistUserSettings = (_state: UserSettingsState) => {}
let mockPersistUAppState = (_state: AppState) => {}

jest.mock('./persistence', () => {
    return {
        getUserSettings: () => ({}),
        getAppState: () => {},
        persistUserSettings: (s: UserSettingsState) => {
            mockPersistUserSettings(s)
        },
        persistAppState: (s: AppState) => {
            mockPersistUAppState(s)
        },
    }
})

describe('store', () => {
    beforeEach(() => {})

    it('should configure store without crashing', () => {
        expect(() => configureStore()).not.toThrow()
    })

    it('should persist state on change', done => {
        mockPersistUserSettings = state => {
            expect(state).toBeDefined()
            done()
        }
        const store = configureStore()

        store.dispatch({ type: 'TEST' })
    })
})
