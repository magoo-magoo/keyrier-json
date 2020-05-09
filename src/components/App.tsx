import { withPerformance } from 'core/logging/performance'
import * as React from 'react'
import { FC, lazy, Suspense } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { useMeasure } from 'react-use'
import { QueryMode } from 'state/State'
import { getQueryMode } from 'store/selectors'
import appStyles from './App.module.scss'
import { GrabbleHeader } from './common/GrabbleHeader'
import grabbleStyles from './common/GrabbleHeader.module.scss'
import Header from './Header'
import LateralMenu from './LateralMenu'

const ResponsiveGridLayout = WidthProvider(Responsive)
const SourceEditor = lazy(() => import(/* webpackChunkName: "SourceEditor" */ 'components/source/SourceEditor'))
const Output = lazy(() => import(/* webpackChunkName: "Output" */ 'components/output/Output'))
const QueryEditor = lazy(() => import(/* webpackChunkName: "QueryEditor" */ 'components/query/QueryEditor'))

const lateralMenuKey = 'LateralMenu'
const sourceEditorKey = 'SourceEditor'
const queryEditorKey = 'QueryEditor'
const outputKey = 'Output'
const layouts = {
    lg: [
        { i: lateralMenuKey, x: 18, y: 0, w: 3, h: 20, minW: 3, minH: 20 },
        { i: sourceEditorKey, x: 3, y: 0, w: 7, h: 15, minW: 5, minH: 10 },
        { i: queryEditorKey, x: 10, y: 0, w: 7, h: 15, minW: 5, minH: 10 },
        { i: outputKey, x: 3, y: 24, w: 14, h: 30, minW: 12, minH: 15 },
    ],
}

type Props = {
    mode: QueryMode
}
const App: FC<Props> = ({ mode }) => {
    const [ref, { width, height }] = useMeasure()
    return (
        <>
            <Header />
            <div className="container-fluid">
                <h1 className="my-5">Paste your JSON and Query it.</h1>
                <ResponsiveGridLayout
                    autoSize={true}
                    className="layout"
                    isResizable={true}
                    layouts={layouts}
                    draggableHandle={`.${grabbleStyles.grabber}`}
                    breakpoints={{ lg: 0 }}
                    cols={{ lg: 24 }}
                    margin={[1, 1]}
                    containerPadding={[10, 10]}
                    rowHeight={25}
                    preventCollision={true}
                >
                    <div key={lateralMenuKey} className={`rounded ${appStyles.gridborder}`}>
                        <GrabbleHeader title="Options">
                            <LateralMenu />
                        </GrabbleHeader>
                    </div>
                    <div ref={ref} key={sourceEditorKey} className={`rounded ${appStyles.gridborder}`}>
                        <GrabbleHeader title="1. Paste your JSON:">
                            <Suspense fallback={'loading...'}>
                                <SourceEditor width={width} height={height} />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key={queryEditorKey} className={`rounded ${appStyles.gridborder}`}>
                        <GrabbleHeader title={`2. Type your ${mode} query:`}>
                            <Suspense fallback={'loading...'}>
                                <QueryEditor />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key={outputKey} className={`rounded ${appStyles.gridborder}`}>
                        <GrabbleHeader title="3. View your results:">
                            <Suspense fallback={'loading...'}>
                                <Output />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                </ResponsiveGridLayout>
            </div>
            <ToastContainer />
        </>
    )
}

export default connect(state => ({ mode: getQueryMode(state) }))(withPerformance(App, 'App'))
