import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from 'store/store'
import Output from './Output'

describe('Output', () => {
    it('Smoke test', async () => {
        const store = await configureStore()

        const result = render(
            <Provider store={store}>
                <Output />
            </Provider>,
        )

        expect(result.baseElement).toBeDefined()
    })
})
