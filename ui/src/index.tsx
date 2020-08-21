import * as React from 'react'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.min.css'
import App from './components/App'
import { logDebug, logError } from './core/logging/logger'
import './index.scss'
import { unregister } from './registerServiceWorker'
import { getTheme } from './store/selectors'
import { configureStore } from './store/store'
import { importThemeStyleCustom } from './themes/themes'
const bootstrap = async () => {
    const store = await configureStore()
    const promises = await Promise.all([
        import(/* webpackChunkName: "react-dom" */ 'react-dom'),
        importThemeStyleCustom(getTheme(store.getState())),
    ])

    const ReactDOM = promises[0]
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root') as HTMLElement,
    )
    unregister()
}

bootstrap()
    .then(() => logDebug('loaded'))
    .catch((e) => logError('boostrap error', e))
