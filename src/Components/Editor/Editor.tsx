import * as React from "react";
import { connect } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import { Action, ResetEditor, resetEditor } from "../../Actions/actions";
import "./Editor.css";
import Output from "./Output/Output";
import QueryEditor from "./QueryEditor/QueryEditor";
import SourceEditor from "./SourceEditor/SourceEditor";

interface Props {
  onReset: () => ResetEditor;
}

export const Editor = (props: Props) => (
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
  { onReset: resetEditor },
)(Editor);
