import * as React from "react";
import { Col, Row } from "reactstrap";
import "./Editor.css";
import Output from "./Output/Output";
import QueryEditor from "./QueryEditor/QueryEditor";
import SourceEditor from "./SourceEditor/SourceEditor";

class Editor extends React.Component {
  public render() {
    return (
      <div className="Editor">
        <h1>Paste your JSON and Query it.</h1>
        <Row>
          <Col sm={12}>
            <SourceEditor />
          </Col>
          <Col sm={6}>
            <QueryEditor />
          </Col>
          <Col sm={6}>
            <Output />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Editor;
