import * as React from 'react'
import Header from './Header'
import { ToastContainer } from 'react-toastify'
import { lazy, Suspense } from 'react'
const SourceEditor = lazy(() => import(/* webpackChunkName: "SourceEditor" */ 'Components/SourceEditor/SourceEditor'))
const Output = lazy(() => import(/* webpackChunkName: "Output" */ 'Components/Output/Output'))
const QueryEditor = lazy(() => import(/* webpackChunkName: "QueryEditor" */ 'Components/QueryEditor/QueryEditor'))

export const App = () => (
  <>
    <Header />
    <div className="container">
      <h1 className="my-5">Paste your JSON and Query it.</h1>
      <div className="row my-5">
        <div className="col">
          <Suspense fallback={'loading...'}>
            <SourceEditor />
          </Suspense>
        </div>
      </div>
      <div className="row align-items-center my-5">
        <div className="col">
          <Suspense fallback={'loading...'}>
            <QueryEditor />
          </Suspense>
        </div>
      </div>
      <div className="row my-5">
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
