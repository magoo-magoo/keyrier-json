import * as React from 'react'
import Header from './Header'
import { ToastContainer } from 'react-toastify'
import { lazy, Suspense, FC } from 'react'
import LateralMenu from './LateralMenu'
import grabbleStyles from './common/GrabbleHeader.module.scss'
import { GrabbleHeader } from './common/GrabbleHeader'
import 'react-grid-layout/css/styles.css'
import { connect } from 'react-redux'
import { getQueryMode } from 'store/selectors'
import { QueryMode } from 'state/State'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { withPerformance } from 'core/logging/performance'

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
            { i: lateralMenuKey, x: 0, y: 0, w: 6, h: 11, minW: 5, minH: 11 },
            { i: sourceEditorKey, x: 6, y: 0, w: 14, h: 14, minW: 10, minH: 14 },
            { i: queryEditorKey, x: 20, y: 0, w: 28, h: 6, minW: 8, minH: 6 },
            { i: outputKey, x: 20, y: 8, w: 28, h: 16, minW: 10, minH: 16 },
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
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 48, md: 36, sm: 24, xs: 12, xxs: 6 }}
                    margin={[20, 20]}
                    containerPadding={[0, 0]}
                    rowHeight={25}
                >
                    <div key={lateralMenuKey}>
                        <GrabbleHeader title="Options">
                            <LateralMenu />
                        </GrabbleHeader>
                    </div>
                    <div key={sourceEditorKey}>
                        <GrabbleHeader title="1. Paste your JSON:">
                            <Suspense fallback={'loading...'}>
                                <SourceEditor />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key={queryEditorKey}>
                        <GrabbleHeader title={`2. Type your ${mode} query:`}>
                            <Suspense fallback={'loading...'}>
                                <QueryEditor />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key={outputKey}>
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
