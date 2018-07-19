import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Badge, Button, Col, Input, Row } from "reactstrap";
import {
  formatSourceText,
  IActionResult,
  IActionResultValue,
  updateSource
} from "../../Actions";
import { IAppState } from "../../State";

interface IProps {
  onChange: (val: string) => IActionResultValue<string>;
  formatText: () => IActionResult;
  sourceText: string;
}

class SourceEditor extends Component<IProps> {
  public render() {
    return (
      <div className="SourceEditor">
        <h3>
          paste your JSON:
        </h3>
        <Row>
          {" "}
          <Col sm={11}>
            <Input
              name="textarea"
              type="textarea"
              placeholder="JSON"
              rows={20}
              cols={20}
              onChange={this.handleOnChange}
              value={this.props.sourceText}
            />
          </Col>
          <Col sm={1}>
            <Button color="primary" onClick={this.handleOnFormatClick}>
              format
            </Button>
          </Col>
        </Row>
        <Row />
      </div>
    );
  }

  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.props.onChange(event.target.value);

  private handleOnFormatClick = () => this.props.formatText();
}

const mapStateToProps = (state: IAppState) => ({
  sourceText: state.rootReducer.source.text
});

export default connect(
  mapStateToProps,
  { onChange: updateSource, formatText: formatSourceText }
)(SourceEditor);
