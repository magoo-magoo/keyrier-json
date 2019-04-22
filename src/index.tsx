import { Provider } from 'react-redux'
import './index.scss'
import 'react-toastify/dist/ReactToastify.min.css'
import { configureStore } from 'store/store'
import * as React from 'react'
import { getTheme } from 'store/selectors'
import { importThemeStyleCustom } from 'themes/themes'
import App from 'components/App'
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
