import * as React from "react";
import { connect } from "react-redux";
import {
  Alert,
  Col,
  Row,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import { jsonBeautify, jsonParseSafe } from "../../../helpers/json";
import OutputTable from "./OutputTable";
import { AppState } from "../../../State/State";
import { Fragment } from "react";

import classNames from "classnames";

// Order matter for Ace editor
import AceEditor from "react-ace";
import "brace/mode/json";
import "brace/theme/github";

interface Props {
  output: string;
  isArray: boolean;
  errorMessage?: string;
}

interface State {
  activeTab: string;
}

export class Output extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      activeTab:  this.props.isArray ? "2" : "1"
    };
  }

  public render() {

    const display = (
      <Fragment>
        <Row>
          <Col>
            <Nav tabs={true}>
              <NavItem>
                <NavLink
                  className={classNames({
                    active: this.state.activeTab === "1"
                  })}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.toggleTab("1");
                  }}
                >
                  Raw JSON view
                </NavLink>
              </NavItem>
              <NavItem hidden={!this.props.isArray}>
                <NavLink
                  className={classNames({
                    active: this.state.activeTab === "2"
                  })}
                  // tslint:disable-next-line:jsx-no-lambda
                  onClick={() => {
                    this.toggleTab("2");
                  }}
                >
                  Table view
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
        </Row>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm={{ size: 10, offset: 2 }}>
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
                    tabSize: 2
                  }}
                  width={"100%"}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <OutputTable
            />
          </TabPane>
        </TabContent>
      </Fragment>
    );

    return (
      <div>
        <Row>
          <Col sm={{ size: 10, offset: 2 }}>
            <h5>Output:</h5>
          </Col>
        </Row>
        <div hidden={!this.props.errorMessage}>
          <Row>
            <Col sm={{ size: 10, offset: 2 }}>
              <Alert color="danger">{this.props.errorMessage}</Alert>
            </Col>
          </Row>
        </div>
        {display}
      </div>
    );
  }

  private toggleTab = (tab: string) => {
    this.setState({ ...this.state, activeTab: tab });
  };
}
const mapStateToProps = (state: Readonly<AppState>): Props => {
  return {
    errorMessage: state.rootReducer.output.errorMessage,
    isArray: state.rootReducer.output.isArray,
    output: state.rootReducer.output.text
  };
};

export default connect(mapStateToProps)(Output);
