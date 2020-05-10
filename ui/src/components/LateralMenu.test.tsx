import { render } from '@testing-library/react'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from 'store/store'
import LateralMenu from './LateralMenu'

describe('LateralMenu', () => {
    it('Smoke test', async () => {
        const store = await configureStore()

        const result = render(
            <Provider store={store}>
                <LateralMenu />
            </Provider>
        )

        const main = await result.findByText(/undo/)
        expect(main).toBeDefined()
    })
})
