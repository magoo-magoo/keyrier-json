import * as React from 'react'
import { connect } from 'react-redux'
import OutputTable from './OutputTable'
import { RootState, tabType } from '../../../State/State'

import classNames from 'classnames'

import {
  getOutputErrorMessage,
  getOutputIsArray,
  getOutputActiveTab,
  getOutputObjectSize,
} from '../../../Store/selectors'
import JsonView from './JsonView'
import { UpdateOutputTabSelection, updateOutputTabSelection } from '../../../Actions/actions'
import { TabContent, TabPane, Alert, Badge } from '../../Deferred/DeferredReactstrap'
import { memo } from 'react'
import { withErrorBoundary } from '../../Common/ErrorBoundary'
import { prettyPrintBytes } from '../../../helpers/string'

interface Props {
  isArray: boolean
  activeTab: tabType
  objSize: number
  setActiveTab: (v: tabType) => UpdateOutputTabSelection
  errorMessage?: string
}

const pointer = {
  cursor: 'pointer',
  fontSize: 'large',
}

const Output: React.FC<Props> = ({ isArray, errorMessage, activeTab, setActiveTab, objSize }) => {
  const display = (
    <>
      <div className="row">
        <div className="col">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className={classNames({
                  active: activeTab === 'RawJson',
                  'nav-link': true,
                })}
                onClick={() => {
                  setActiveTab('RawJson')
                }}
                style={pointer}
              >
                Raw JSON view
              </a>
            </li>
            <li className="nav-item" hidden={!isArray}>
              <a
                className={classNames({
                  active: activeTab === 'Table',
                  'nav-link': true,
                })}
                onClick={() => {
                  setActiveTab('Table')
                }}
                style={pointer}
              >
                Table view
              </a>
            </li>
          </ul>
        </div>
      </div>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="RawJson">
          <div className="row">
            <div className="col-sm-2 pt-5">
              <h3>
                <Badge color="secondary" pill={true}>
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
  )

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
      {display}
    </>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    errorMessage: getOutputErrorMessage(state),
    isArray: getOutputIsArray(state),
    activeTab: getOutputActiveTab(state),
    objSize: getOutputObjectSize(state),
  }
}

export default connect(
  mapStateToProps,
  { setActiveTab: updateOutputTabSelection }
)(memo(withErrorBoundary(Output)))
