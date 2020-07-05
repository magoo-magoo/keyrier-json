import Actions from 'actions/actions'
import classNames from 'classnames'
import * as React from 'react'
import { FC, memo, useCallback } from 'react'
import { connect } from 'react-redux'
import { Alert, Badge, Button, TabContent, TabPane } from 'reactstrap'
import { withErrorBoundary } from '../../components/common/ErrorBoundary'
import { prettyPrintBytes } from '../../core/converters/string'
import { withPerformance } from '../../core/logging/performance'
import { RootState, tabType } from '../../state/State'
import { getOutputActiveTab, getOutputErrorMessage, getOutputIsArray, getOutputObjectSize } from '../../store/selectors'
import JsonView from './JsonView'
import styles from './Output.module.scss'
import OutputTable from './OutputTable'

interface Props {
    isArray: boolean
    activeTab: tabType
    objSize: number
    setActiveTab: typeof Actions.updateOutputTabSelection
    errorMessage?: string
}

const Output: FC<Props> = ({ isArray, errorMessage, activeTab, setActiveTab, objSize }) => {
    const handleActiveTable = useCallback(() => setActiveTab('Table'), [setActiveTab])
    const handleActiveRawJson = useCallback(() => setActiveTab('RawJson'), [setActiveTab])
    return (
        <>
            {errorMessage && (
                <div>
                    <div className="row">
                        <div className="col-sm-10 offset-sm-2">
                            <Alert className="row align-items-center" color="danger">
                                <i className="material-icons mr-2">error</i>
                                <span>{errorMessage}</span>
                            </Alert>
                        </div>
                    </div>
                </div>
            )}
            <>
                <div className="row">
                    <div className="col">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <Button
                                    className={classNames({
                                        active: activeTab === 'RawJson',
                                        'nav-link': true,
                                        [styles.pointer]: true,
                                    })}
                                    onClick={handleActiveRawJson}
                                >
                                    View raw JSON
                                </Button>
                            </li>
                            <li className="nav-item" hidden={!isArray}>
                                <Button
                                    className={classNames({
                                        active: activeTab === 'Table',
                                        'nav-link': true,
                                        [styles.pointer]: true,
                                    })}
                                    onClick={handleActiveTable}
                                >
                                    View table
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                <TabContent activeTab={activeTab}>
                    {activeTab === 'RawJson' && (
                        <TabPane tabId="RawJson">
                            <div className="row">
                                <div className="col-sm-2 pt-5">
                                    <h3>
                                        <Badge id="badgeSize" color="info" pill={true}>
                                            {prettyPrintBytes(objSize)}
                                        </Badge>
                                    </h3>
                                </div>
                                <div className="col-sm-10">
                                    <JsonView />
                                </div>
                            </div>
                        </TabPane>
                    )}
                    <TabPane tabId="Table">{activeTab === 'Table' && <OutputTable />}</TabPane>
                </TabContent>
            </>
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    errorMessage: getOutputErrorMessage(state),
    isArray: getOutputIsArray(state),
    activeTab: getOutputActiveTab(state),
    objSize: getOutputObjectSize(state),
})

export default connect(mapStateToProps, { setActiveTab: Actions.updateOutputTabSelection })(
    memo(withErrorBoundary(withPerformance(Output, 'Output')))
)
