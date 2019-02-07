import { Provider } from 'react-redux'
import './index.css'
import registerServiceWorker from './registerServiceWorker'
import { configureStore } from './Store/store'
import * as React from 'react'
import App from './Components/App'
import { getTheme } from './Store/selectors'
import { importThemeStyleCustom } from './Themes/themes'

const start = async () => {
  const store = configureStore()

  const promises = await Promise.all([
    import(/* webpackChunkName: "react-dom" */ 'react-dom'),
    importThemeStyleCustom(getTheme(store.getState())),
  ])

  const ReactDOM = promises[0]
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  )

  registerServiceWorker()
  ;(await import(/* webpackChunkName: "react-loadable" */ 'react-loadable')).preloadAll()
}

start()
