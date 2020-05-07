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

type Props = {
    mode: QueryMode
}

const lateralMenuKey = 'LateralMenu'
const sourceEditorKey = 'SourceEditor'
const queryEditorKey = 'QueryEditor'
const outputKey = 'Output'

const App: FC<Props> = ({ mode }) => {
    const layouts = {
        lg: [
            { i: lateralMenuKey, x: 0, y: 0, w: 6, h: 20, minW: 6, minH: 20 },
            { i: sourceEditorKey, x: 6, y: 0, w: 21, h: 20, minW: 21, minH: 20 },
            { i: queryEditorKey, x: 28, y: 0, w: 21, h: 20, minW: 21, minH: 20 },
            { i: outputKey, x: 0, y: 8, w: 48, h: 32, minW: 48, minH: 32 },
        ],
        md: [
            { i: lateralMenuKey, x: 0, y: 0, w: 6, h: 11, minW: 5, minH: 11 },
            { i: sourceEditorKey, x: 6, y: 0, w: 14, h: 14, minW: 10, minH: 14 },
            { i: queryEditorKey, x: 0, y: 14, w: 28, h: 6, minW: 8, minH: 6 },
            { i: outputKey, x: 0, y: 19, w: 28, h: 16, minW: 10, minH: 16 },
        ],
        sm: [
            { i: lateralMenuKey, x: 0, y: 0, w: 6, h: 11, minW: 5, minH: 11 },
            { i: sourceEditorKey, x: 6, y: 0, w: 14, h: 14, minW: 10, minH: 14 },
            { i: queryEditorKey, x: 0, y: 14, w: 28, h: 6, minW: 8, minH: 6 },
            { i: outputKey, x: 0, y: 19, w: 28, h: 16, minW: 10, minH: 16 },
        ],
        xs: [
            { i: lateralMenuKey, x: 0, y: 0, w: 16, h: 11, minW: 5, minH: 11 },
            { i: sourceEditorKey, x: 6, y: 0, w: 14, h: 14, minW: 10, minH: 14 },
            { i: queryEditorKey, x: 0, y: 14, w: 28, h: 6, minW: 8, minH: 6 },
            { i: outputKey, x: 0, y: 19, w: 28, h: 16, minW: 10, minH: 16 },
        ],
        xxs: [
            { i: lateralMenuKey, x: 0, y: 0, w: 16, h: 11, minW: 5, minH: 11 },
            { i: sourceEditorKey, x: 6, y: 0, w: 14, h: 14, minW: 10, minH: 14 },
            { i: queryEditorKey, x: 0, y: 14, w: 28, h: 6, minW: 8, minH: 6 },
            { i: outputKey, x: 0, y: 19, w: 28, h: 16, minW: 10, minH: 16 },
        ],
    }
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
                    cols={{ lg: 48, md: 36, sm: 24, xs: 12, xxs: 6 }}
                    margin={[0, 0]}
                    containerPadding={[10, 10]}
                    rowHeight={25}
                >
                    <div
                        key={lateralMenuKey}
                        className={`rounded overflow-auto ${appStyles.gridborder}`}
                        style={{ borderWidth: '5px !important' }}
                    >
                        <GrabbleHeader title="Options">
                            <LateralMenu />
                        </GrabbleHeader>
                    </div>
                    <div ref={ref} key={sourceEditorKey} className={`rounded overflow-auto ${appStyles.gridborder}`}>
                        <GrabbleHeader title="1. Paste your JSON:">
                            <Suspense fallback={'loading...'}>
                                <SourceEditor width={width} height={height} />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key={queryEditorKey} className={`rounded overflow-auto ${appStyles.gridborder}`}>
                        <GrabbleHeader title={`2. Type your ${mode} query:`}>
                            <Suspense fallback={'loading...'}>
                                <QueryEditor />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key={outputKey} className={`rounded ${appStyles.gridborder} ${appStyles.output}`}>
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
