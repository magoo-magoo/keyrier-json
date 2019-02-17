import * as React from 'react'
import './Editor.css'
import { withErrorBoundary } from '../Common/ErrorBoundary'
import { lazy, Suspense } from 'react'
const SourceEditor = lazy(() => import(/* webpackChunkName: "SourceEditor" */ './SourceEditor/SourceEditor'))
const Output = lazy(() => import(/* webpackChunkName: "Output" */ './Output/Output'))
const QueryEditor = lazy(() => import(/* webpackChunkName: "QueryEditor" */ './QueryEditor/QueryEditor'))

const Editor = () => {
  return (
    <>
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
    </>
  )
}

export default withErrorBoundary(Editor)
