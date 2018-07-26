import * as React from "react";
import { connect } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import { Action, IResetEditor, resetEditor } from "../../Actions/Actions";
import "./Editor.css";
import Output from "./Output/Output";
import QueryEditor from "./QueryEditor/QueryEditor";
import SourceEditor from "./SourceEditor/SourceEditor";

interface IProps {
  onReset: () => IResetEditor;
}

export const Editor = (props: IProps) => (
  <div className="Editor">
    <h1>Paste your JSON and Query it.</h1>
    <Row>
      <Col>
        <Button className="float-right" color="warning" onClick={props.onReset}>
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

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  { onReset: resetEditor }
)(Editor);
