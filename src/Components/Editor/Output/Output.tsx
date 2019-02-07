import * as React from 'react'
import { connect } from 'react-redux'
import OutputTable from './OutputTable'
import { RootState, tabType } from '../../../State/State'

import classNames from 'classnames'

import { getOutputErrorMessage, getOutputIsArray, getOutputActiveTab } from '../../../Store/selectors'
import JsonView from './JsonView'
import { UpdateOutputTabSelection, updateOutputTabSelection } from '../../../Actions/actions'
import { TabContent, TabPane, Alert } from '../../Deferred/DeferredReactstrap'

interface Props {
  isArray: boolean
  activeTab: tabType
  setActiveTab: (v: tabType) => UpdateOutputTabSelection
  errorMessage?: string
}

const pointer = {
  cursor: 'pointer',
  fontSize: 'large',
}

export const Output: React.FC<Props> = ({ isArray, errorMessage, activeTab, setActiveTab }) => {
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
            <div className="col-sm-10 offset-sm-2">
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
    <div>
      <div className="row">
        <div className="col-sm-10 offset-sm-2">
          <h3>Output:</h3>
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
    </div>
  )
}

const mapStateToProps = (state: Readonly<RootState>) => {
  return {
    errorMessage: getOutputErrorMessage(state),
    isArray: getOutputIsArray(state),
    activeTab: getOutputActiveTab(state),
  }
}

export default connect(
  mapStateToProps,
  { setActiveTab: updateOutputTabSelection }
)(Output)
