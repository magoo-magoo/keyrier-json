import * as React from 'react';
import { connect } from 'react-redux';
import { Alert, TabContent, TabPane } from '../../Deferred/DeferredReactstrap';
import { jsonBeautify } from '../../../helpers/json';
import OutputTable from './OutputTable';
import { AppState } from '../../../State/State';
import { Fragment } from 'react';

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

interface State {
  activeTab: tabType;
}

type tabType = 'RawJson' | 'Table';

export class Output extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab: this.props.isArray ? 'Table' : 'RawJson',
    };
  }

  public componentDidUpdate() {
    if (!this.props.isArray && this.state.activeTab === 'Table') {
      this.setState({ ...this.state, activeTab: 'RawJson' });
    }
  }
  public render() {
    const display = (
      <Fragment>
        <div className="row">
          <div className="col">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={classNames({
                    active:
                      !this.props.isArray || this.state.activeTab === 'RawJson',
                    'nav-link': true,
                  })}
                  onClick={() => {
                    this.toggleTab('RawJson');
                  }}
                >
                  Raw JSON view
                </a>
              </li>
              <li className="nav-item" hidden={!this.props.isArray}>
                <a
                  className={classNames({
                    active:
                      !this.props.isArray || this.state.activeTab === 'Table',
                    'nav-link': true,
                  })}
                  onClick={() => {
                    this.toggleTab('Table');
                  }}
                >
                  Table view
                </a>
              </li>
            </ul>
          </div>
        </div>
        <TabContent activeTab={this.state.activeTab}>
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
                  value={jsonBeautify(this.props.output)}
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
      </Fragment>
    );

    return (
      <div>
        <div className="row">
          <div className="col-sm-10 offset-sm-2">
            <h3>Output:</h3>
          </div>
        </div>
        <div hidden={!this.props.errorMessage}>
          <div className="row">
            <div className="col-sm-10 offset-sm-2">
              <Alert color="danger">{this.props.errorMessage}</Alert>
            </div>
          </div>
        </div>
        {display}
      </div>
    );
  }

  private toggleTab = (tab: tabType) => {
    this.setState({ ...this.state, activeTab: tab });
  };
}
const mapStateToProps = (state: Readonly<AppState>): Props => {
  return {
    errorMessage: getOutputErrorMessage(state),
    isArray: getOutputIsArray(state),
    output: getOutputText(state),
  };
};

export default connect(mapStateToProps)(Output);
