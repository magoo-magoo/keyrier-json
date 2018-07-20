import "./App.css";

import * as React from "react";
import {
  Col,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row
} from "reactstrap";

import Editor from "./Editor/Editor";

class App extends React.Component {
  public render() {
    return (
      <Container className="App">
        <Navbar color="dark" dark={true} expand="md">
          <NavbarBrand href="/">Keyrier JSON</NavbarBrand>
          <Nav className="ml-auto" navbar={true}>
            <NavItem>
              <NavLink href="https://github.com/magoo-magoo/keyrier-json">
                GitHub
              </NavLink>
            </NavItem>
          </Nav>
        </Navbar>
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
