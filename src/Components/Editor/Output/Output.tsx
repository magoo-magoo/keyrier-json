import * as React from 'react';
import { connect } from 'react-redux';
import { Alert, TabContent, TabPane } from '../../Deferred/DeferredReactstrap';
import OutputTable from './OutputTable';
import { RootState } from '../../../State/State';

import classNames from 'classnames';

import {
  getOutputErrorMessage,
  getOutputIsArray,
} from '../../../Store/selectors';
import JsonView from './JsonView';

interface Props {
  isArray: boolean;
  errorMessage?: string;
}

type tabType = 'RawJson' | 'Table';

const pointer = {
  cursor: 'pointer',
  fontSize: 'large',
};

export const Output: React.SFC<Props> = ({ isArray, errorMessage }) => {
  const [activeTab, setActiveTab] = React.useState(
    isArray ? 'Table' : ('RawJson' as tabType)
  );
  React.useEffect(() => {
    if (!isArray && activeTab === 'Table') {
      setActiveTab('RawJson');
    }
  });

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
                  setActiveTab('RawJson');
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
                  setActiveTab('Table');
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
  );

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
  );
};

const mapStateToProps = (state: Readonly<RootState>): Props => {
  return {
    errorMessage: getOutputErrorMessage(state),
    isArray: getOutputIsArray(state),
  };
};

export default connect(mapStateToProps)(Output);
