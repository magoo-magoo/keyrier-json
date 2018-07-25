import * as React from "react";
import { connect } from "react-redux";
import { Alert, Button, Col, Row } from "reactstrap";
import { jsonBeautify, jsonParseSafe } from "../../../helpers/json";
import OutputTable from "./OutputTable";

// Order matter for Ace editor
// tslint:disable-next-line:ordered-imports
import AceEditor from "react-ace";
// tslint:disable-next-line:ordered-imports
import "brace/mode/json";
// tslint:disable-next-line:ordered-imports
import "brace/theme/github";
import { IAppState } from "../../../State/State";

interface IProps {
  output: string;
  isArray: boolean;
  errorMessage?: string;
}

interface IState {
  shouldShowAsTable: boolean;
}

export class Output extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      shouldShowAsTable: true
    };
  }

  public render() {
    const shouldShowAsTable =
      this.props.isArray && this.state.shouldShowAsTable;
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
        <Row>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button
              color="link"
              hidden={!this.props.isArray}
              onClick={this.toggleShowTable}
            >
              {shouldShowAsTable
                ? "Switch to raw JSON view"
                : "Switch to table view"}
            </Button>
          </Col>
        </Row>
        <Row hidden={shouldShowAsTable}>
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
        <div hidden={!shouldShowAsTable}>
          <OutputTable
            data={shouldShowAsTable ? jsonParseSafe(this.props.output) : []}
          />
        </div>
      </div>
    );
  }

  private toggleShowTable = () => {
    this.setState({ shouldShowAsTable: !this.state.shouldShowAsTable });
  };
}
const mapStateToProps = (state: IAppState): IProps => {
  return {
    errorMessage: state.rootReducer.output.errorMessage,
    isArray: state.rootReducer.output.isArray,
    output: state.rootReducer.output.text
  };
};

export default connect(mapStateToProps)(Output);
