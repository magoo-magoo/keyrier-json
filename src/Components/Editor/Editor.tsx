import * as React from "react";
import { connect } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import { Action, resetEditor } from "../../Actions/Actions";
import "./Editor.css";
import Output from "./Output/Output";
import QueryEditor from "./QueryEditor/QueryEditor";
import SourceEditor from "./SourceEditor/SourceEditor";

interface IProps {
  onReset: () => Action;
}

export class Editor extends React.Component<IProps> {
  public render() {
    return (
      <div className="Editor">
        <h1>Paste your JSON and Query it.</h1>
        <Row>
          <Col>
            <Button
              className="float-right"
              color="warning"
              onClick={this.handleOnResetClick}
            >
              Reset
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <SourceEditor />
          </Col>
        </Row>
        <Row>
          <Col>
            <QueryEditor />
          </Col>
        </Row>
        <Row>
          <Col>
            <Output />
          </Col>
        </Row>
      </div>
    );
  }

  private handleOnResetClick = () => {
    this.props.onReset();
  };
}

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  { onReset: resetEditor }
)(Editor);
