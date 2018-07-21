import * as React from "react";
import { connect } from "react-redux";
import { Alert, Button, Col, Row } from "reactstrap";
import { jsonParseSafe } from "../../helpers/json";
import { IAppState } from "../../State";
import OutputTable from "./OutputTable";

interface IProps {
  output: string;
  isArray: boolean;
  errorMessage?: string;
}

interface IState {
  shouldShowAsTable: boolean;
}

class Output extends React.Component<IProps, IState> {
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
          <Col>
            <h5>Output:</h5>
          </Col>
        </Row>
        <div hidden={!this.props.errorMessage}>
        <Row>
          <Col>
            <Alert color="danger">{this.props.errorMessage}</Alert>
          </Col>
        </Row>
        </div>
        <Row>
          <Col>
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
        <Row>
          <Col>
            <code hidden={shouldShowAsTable}>{this.props.output}</code>
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
