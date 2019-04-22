import * as React from 'react'
import { connect } from 'react-redux'
import OutputTable from './OutputTable'
import { RootState, tabType } from 'state/State'

import classNames from 'classnames'

import { getOutputErrorMessage, getOutputIsArray, getOutputActiveTab, getOutputObjectSize } from 'store/selectors'
import JsonView from './JsonView'
import { updateOutputTabSelection } from 'actions/actions'
import { TabContent, TabPane, Alert, Badge } from 'reactstrap'
import { memo, useCallback, FC } from 'react'
import { prettyPrintBytes } from 'helpers/string'
import { withErrorBoundary } from 'components/common/ErrorBoundary'

interface Props {
  isArray: boolean
  activeTab: tabType
  objSize: number
  setActiveTab: typeof updateOutputTabSelection
  errorMessage?: string
}

const pointer = {
  cursor: 'pointer',
  fontSize: 'large',
}

const Output: FC<Props> = ({ isArray, errorMessage, activeTab, setActiveTab, objSize }) => {
  const handleActiveTable = useCallback(() => setActiveTab('Table'), [setActiveTab])
  const handleActiveRawJson = useCallback(() => setActiveTab('RawJson'), [setActiveTab])
  return (
    <>
      <div className="row">
        <div className="col-sm-10 offset-sm-2">
          <h3>3. View your results:</h3>
        </div>
      </div>
      <div hidden={!errorMessage}>
        <div className="row">
          <div className="col-sm-10 offset-sm-2">
            <Alert color="danger">{errorMessage}</Alert>
          </div>
        </div>
      </div>
      <>
        <div className="row">
          <div className="col">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={classNames({
                    active: activeTab === 'RawJson',
                    'nav-link': true,
                  })}
                  onClick={handleActiveRawJson}
                  style={pointer}
                >
                  Raw JSON view
                </button>
              </li>
              <li className="nav-item" hidden={!isArray}>
                <button
                  className={classNames({
                    active: activeTab === 'Table',
                    'nav-link': true,
                  })}
                  onClick={handleActiveTable}
                  style={pointer}
                >
                  Table view
                </button>
              </li>
            </ul>
          </div>
        </div>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="RawJson">
            <div className="row">
              <div className="col-sm-2 pt-5">
                <h3>
                  <Badge id="badgeSize" color="secondary" pill={true}>
                    {prettyPrintBytes(objSize)}
                  </Badge>
                </h3>
              </div>
              <div className="col-sm-10">
                <JsonView />
              </div>
            </div>
          </TabPane>
          <TabPane tabId="Table">
            <OutputTable />
          </TabPane>
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

export default connect(
  mapStateToProps,
  { setActiveTab: updateOutputTabSelection }
)(memo(withErrorBoundary(Output)))
