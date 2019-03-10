import { Provider } from 'react-redux'
import './index.css'
import 'react-toastify/dist/ReactToastify.min.css'
import registerServiceWorker from './registerServiceWorker'
import { configureStore } from './Store/store'
import * as React from 'react'
import { getTheme } from './Store/selectors'
import { importThemeStyleCustom } from './Themes/themes'
import * as Loadable from 'react-loadable'
import { load } from './Store/persistence'
import { UserSettingsState } from './State/State'
;(async () => {
  const store = configureStore()

  const promises = await Promise.all([
    import(/* webpackChunkName: "react-dom" */ 'react-dom'),
    import(/* webpackChunkName: "App" */ './Components/App'),
    importThemeStyleCustom(getTheme(store.getState())),
  ])

  const userSettings = load<UserSettingsState>('keyrier-json.user.settings')

  const ReactDOM = promises[0]
  const App = promises[1].default

  if (userSettings.concurrentModeEnable) {
    const Concurrent = (React as any).unstable_ConcurrentMode
    const root = (ReactDOM as any).unstable_createRoot(document.getElementById('root'))
    root.render(
      <Concurrent>
        <Provider store={store}>
          <App />
        </Provider>
      </Concurrent>
    )
  } else {
    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    )
  }

  Loadable.preloadAll()

  registerServiceWorker()
})()
