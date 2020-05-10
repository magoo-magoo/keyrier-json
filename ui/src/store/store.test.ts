import { AppState, UserSettingsState } from 'state/State'
import { configureStore } from './store'

let mockPersistUserSettings = (_state: UserSettingsState) => {}
let mockPersistUAppState = (_state: AppState) => {}

jest.mock('./persistence', () => {
    return {
        getUserSettings: () => Promise.resolve({}),
        getAppState: () => Promise.resolve({}),
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

    it('should configure store without crashing', done => {
        expect(() => configureStore().then(() => done())).not.toThrow()
    })

    it('should persist state on change', done => {
        mockPersistUserSettings = state => {
            expect(state).toBeDefined()
            done()
        }
        configureStore().then(store => {
            store.dispatch({ type: 'TEST' })
        })
    })
})
