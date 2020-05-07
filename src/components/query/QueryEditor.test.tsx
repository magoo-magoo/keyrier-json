import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from 'store/store'
import QueryEditor from './QueryEditor'

describe('QueryEditor', () => {
    it('Smoke test', async () => {
        const store = configureStore()

        const result = render(
            <Provider store={store}>
                <QueryEditor />
            </Provider>
        )

        expect(result.baseElement).toBeDefined()
    })
})
