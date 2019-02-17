import { Provider } from 'react-redux'
import './index.css'
import 'react-toastify/dist/ReactToastify.min.css'
import registerServiceWorker from './registerServiceWorker'
import { configureStore } from './Store/store'
import * as React from 'react'
import { getTheme } from './Store/selectors'
import { importThemeStyleCustom } from './Themes/themes'
import * as Loadable from 'react-loadable'

const start = async () => {
  const store = configureStore()

  const promises = await Promise.all([
    import(/* webpackChunkName: "react-dom" */ 'react-dom'),
    import(/* webpackChunkName: "App" */ './Components/App'),
    importThemeStyleCustom(getTheme(store.getState())),
  ])

  await Loadable.preloadAll()

  const ReactDOM = promises[0]
  const App = promises[1].default
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  )

  registerServiceWorker()
}

start()
