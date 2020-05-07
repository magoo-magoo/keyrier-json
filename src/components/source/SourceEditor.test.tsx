import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from 'store/store'
import SourceEditor from './SourceEditor'

describe('SourceEditor', () => {
    it('Smoke test', async () => {
        const store = configureStore()

        const { baseElement } = render(
            <Provider store={store}>
                <SourceEditor />
            </Provider>
        )

        expect(baseElement).toBeDefined()
    })
})
