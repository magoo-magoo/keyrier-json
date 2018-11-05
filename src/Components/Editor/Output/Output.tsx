import * as React from 'react';
import { connect } from 'react-redux';
import { Alert, TabContent, TabPane } from '../../Deferred/DeferredReactstrap';
import { jsonBeautify } from '../../../helpers/json';
import OutputTable from './OutputTable';
import { AppState } from '../../../State/State';

import classNames from 'classnames';

import {
  getOutputErrorMessage,
  getOutputIsArray,
  getOutputText,
} from '../../../Store/selectors';
import { AceEditor } from '../../Deferred/DeferredAceEditor';

interface Props {
  output: string;
  isArray: boolean;
  errorMessage?: string;
}

type tabType = 'RawJson' | 'Table';

export const Output: React.SFC<Props> = props => {
  const [activeTab, setActiveTab] = React.useState(
    props.isArray ? 'Table' : ('RawJson' as tabType)
  );
  React.useEffect(() => {
    if (!props.isArray && activeTab === 'Table') {
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
                  active: !props.isArray || activeTab === 'RawJson',
                  'nav-link': true,
                })}
                onClick={() => {
                  setActiveTab('RawJson');
                }}
              >
                Raw JSON view
              </a>
            </li>
            <li className="nav-item" hidden={!props.isArray}>
              <a
                className={classNames({
                  active: !props.isArray || activeTab === 'Table',
                  'nav-link': true,
                })}
                onClick={() => {
                  setActiveTab('Table');
                }}
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
              <AceEditor
                mode="json"
                theme="github"
                name="outputAceEditor"
                fontSize={18}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={jsonBeautify(props.output)}
                minLines={10}
                maxLines={100}
                wrapEnabled={false}
                readOnly={true}
                editorProps={{ $blockScrolling: Infinity }}
                setOptions={{
                  showLineNumbers: true,
                  tabSize: 2,
                }}
                width={'100%'}
              />
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
      <div hidden={!props.errorMessage}>
        <div className="row">
          <div className="col-sm-10 offset-sm-2">
            <Alert color="danger">{props.errorMessage}</Alert>
          </div>
        </div>
      </div>
      {display}
    </div>
  );
};

const mapStateToProps = (state: Readonly<AppState>): Props => {
  return {
    errorMessage: getOutputErrorMessage(state),
    isArray: getOutputIsArray(state),
    output: getOutputText(state),
  };
};

export default connect(mapStateToProps)(Output);
