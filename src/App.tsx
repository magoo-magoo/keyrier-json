import "./App.css";

import * as React from "react";
import { Col, Container, Row } from "reactstrap";

import Editor from "./Editor/Editor";

class App extends React.Component {
  public render() {
    return (
      <Container className="App">
        <Row className="App-header">
          <Col>
            <h1 className="App-title">Keyrier JSON</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Editor />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
