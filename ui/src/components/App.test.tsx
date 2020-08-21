import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from 'store/store'
import App from './App'

describe('App', () => {
    it('Smoke test', async () => {
        const store = await configureStore()

        const { baseElement } = render(
            <Provider store={store}>
                <App />
            </Provider>,
        )

        expect(baseElement).toBeDefined()
    })
})
