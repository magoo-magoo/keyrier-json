import * as React from 'react'
import Header from './Header'
import { ToastContainer } from 'react-toastify'
import { lazy, Suspense, FC } from 'react'
import LateralMenu from './LateralMenu'
import GridLayout from 'react-grid-layout'
import grabbleStyles from './common/GrabbleHeader.module.scss'
import { GrabbleHeader } from './common/GrabbleHeader'
import 'react-grid-layout/css/styles.css'
import { connect } from 'react-redux'
import { getQueryMode } from 'store/selectors'
import { QueryMode } from 'state/State'

const SourceEditor = lazy(() => import(/* webpackChunkName: "SourceEditor" */ 'components/source/SourceEditor'))
const Output = lazy(() => import(/* webpackChunkName: "Output" */ 'components/output/Output'))
const QueryEditor = lazy(() => import(/* webpackChunkName: "QueryEditor" */ 'components/query/QueryEditor'))

type Props = {
    mode: QueryMode
}

const App: FC<Props> = ({ mode }) => {
    const layout = [
        { i: 'LateralMenu', x: 0, y: 0, w: 6, h: 7, minW: 5 },
        { i: 'SourceEditor', x: 6, y: 0, w: 14, h: 8, minW: 10, minH: 8 },
        { i: 'QueryEditor', x: 20, y: 0, w: 28, h: 4, minW: 8, minH: 4 },
        { i: 'Output', x: 20, y: 8, w: 28, h: 16, minW: 10, minH: 16 },
    ]
    return (
        <>
            <Header />
            <div className="container-fluid">
                <h1 className="my-5">Paste your JSON and Query it.</h1>
                <GridLayout
                    autoSize={true}
                    className="layout"
                    isResizable={true}
                    draggableHandle={`.${grabbleStyles.grabber}`}
                    layout={layout}
                    cols={48}
                    width={1800}
                    margin={[20, 20]}
                    containerPadding={[0, 0]}
                    rowHeight={50}
                >
                    <div key="LateralMenu">
                        <GrabbleHeader title="Keyrier">
                            <LateralMenu />
                        </GrabbleHeader>
                    </div>
                    <div key="SourceEditor">
                        <GrabbleHeader title="1. Paste your JSON:">
                            <Suspense fallback={'loading...'}>
                                <SourceEditor />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key="QueryEditor">
                        <GrabbleHeader title={`2. Type your ${mode} query:`}>
                            <Suspense fallback={'loading...'}>
                                <QueryEditor />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                    <div key="Output">
                        <GrabbleHeader title="3. View your results:">
                            <Suspense fallback={'loading...'}>
                                <Output />
                            </Suspense>
                        </GrabbleHeader>
                    </div>
                </GridLayout>
            </div>
            <ToastContainer />
        </>
    )
}

export default connect(state => ({ mode: getQueryMode(state) }))(App)
