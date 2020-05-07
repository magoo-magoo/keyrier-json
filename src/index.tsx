import { Provider } from 'react-redux'
import './index.scss'
import 'react-toastify/dist/ReactToastify.min.css'
import { configureStore } from 'store/store'
import * as React from 'react'
import { getTheme } from 'store/selectors'
import { importThemeStyleCustom } from 'themes/themes'
import App from 'components/App'
import { unregister } from 'registerServiceWorker'
import { logDebug, logError } from 'core/logging/logger'
const bootstrap = async () => {
    const store = configureStore()
    const promises = await Promise.all([
        import(/* webpackChunkName: "react-dom" */ 'react-dom'),
        importThemeStyleCustom(getTheme(store.getState())),
    ])

    const ReactDOM = promises[0]
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root') as HTMLElement
    )
    unregister()
}

bootstrap()
    .then(() => logDebug('loaded'))
    .catch(e => logError('boostrap error', e))
