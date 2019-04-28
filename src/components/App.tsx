import styles from './App.module.scss'
import * as React from 'react'
import Header from './Header'
import { ToastContainer } from 'react-toastify'
import { lazy, Suspense } from 'react'
import LateralMenu from './LateralMenu'
const SourceEditor = lazy(() => import(/* webpackChunkName: "SourceEditor" */ 'components/source/SourceEditor'))
const Output = lazy(() => import(/* webpackChunkName: "Output" */ 'components/output/Output'))
const QueryEditor = lazy(() => import(/* webpackChunkName: "QueryEditor" */ 'components/query/QueryEditor'))

export const App = () => (
  <>
    <Header />
    <div className="container">
      <h1 className="my-5">Paste your JSON and Query it.</h1>
      <div className="row">
        <div className="col-sm-2">
          <LateralMenu />
        </div>
        <div className="col-sm-10">
          <Suspense fallback={'loading...'}>
            <SourceEditor />
          </Suspense>
          <div className="my-5">
            <Suspense fallback={'loading...'}>
              <QueryEditor />
            </Suspense>
          </div>
        </div>
      </div>
      <div className={`row ${styles.output}`}>
        <div className="col">
          <Suspense fallback={'loading...'}>
            <Output />
          </Suspense>
        </div>
      </div>
    </div>
    <ToastContainer />
  </>
)

export default App
