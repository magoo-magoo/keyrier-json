import { updateLayouts } from 'actions/actions'
import { configuration } from 'config'
import { withPerformance } from 'core/logging/performance'
import * as React from 'react'
import { FC, lazy, Suspense } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import { connect } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { QueryMode } from 'state/State'
import { getLayouts, getQueryMode } from 'store/selectors'
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
    layouts: ReactGridLayout.Layouts
    updateGridLayouts: typeof updateLayouts
}
const App: FC<Props> = ({ mode, layouts, updateGridLayouts }) => {
    const onLayoutChange = (_: ReactGridLayout.Layout[], newLayouts: ReactGridLayout.Layouts) => {
        updateGridLayouts(newLayouts)
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
                    breakpoints={{ lg: 0 }}
                    cols={{ lg: 24 }}
                    margin={[1, 1]}
                    containerPadding={[10, 10]}
                    rowHeight={25}
                    onLayoutChange={onLayoutChange}
                    verticalCompact={true}
                    compactType="vertical"
                >
                    <div key={configuration.layout.keys.lateralMenuKey} className={`rounded ${appStyles.gridborder}`}>
                        <GrabbleHeader title="Options">
                            <LateralMenu />
                        </GrabbleHeader>
                    </div>
                    <div key={configuration.layout.keys.sourceEditorKey} className={`rounded ${appStyles.gridborder}`}>
                        <GrabbleHeader title="1. Paste your JSON:">
                            <Suspense fallback={'loading...'}>
                                <SourceEditor />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key={configuration.layout.keys.queryEditorKey} className={`rounded ${appStyles.gridborder}`}>
                        <GrabbleHeader title={`2. Type your ${mode} query:`}>
                            <Suspense fallback={'loading...'}>
                                <QueryEditor />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key={configuration.layout.keys.outputKey} className={`rounded ${appStyles.gridborder}`}>
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

export default connect(state => ({ mode: getQueryMode(state), layouts: getLayouts(state) }), {
    updateGridLayouts: updateLayouts,
})(withPerformance(App, 'App'))