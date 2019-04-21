import { Provider } from 'react-redux'
import './index.scss'
import 'react-toastify/dist/ReactToastify.min.css'
import { configureStore } from 'Store/store'
import * as React from 'react'
import { getTheme } from 'Store/selectors'
import { importThemeStyleCustom } from 'Themes/themes'
import App from 'Components/App'
;(async () => {
  const store = configureStore()

  const promises = await Promise.all([
    import(/* webpackChunkName: "react-dom" */ 'react-dom'),
    importThemeStyleCustom(getTheme(store.getState())),
  ])

  const ReactDOM = promises[0]

  const Concurrent = (React as any).unstable_ConcurrentMode
  const root = (ReactDOM as any).unstable_createRoot(document.getElementById('root'))
  root.render(
    <Concurrent>
      <Provider store={store}>
        <App />
      </Provider>
    </Concurrent>
  )

  // registerServiceWorker()
})()
