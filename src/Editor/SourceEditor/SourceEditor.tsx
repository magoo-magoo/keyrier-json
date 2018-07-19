import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Button, Input } from 'reactstrap';
import { formatSourceText, IActionResult, IActionResultValue, updateSource } from "../../Actions";
import { IAppState } from "../../State";

interface IProps {
  onChange: (val: string) => IActionResultValue<string>;
  formatText: () => IActionResult;
  sourceText: string
}

class SourceEditor extends Component<IProps> {
  public render() {
    return (
      <div className="SourceEditor">
        <p>paste your JSON: </p>
        <Input
          name="textarea"
          type="textarea"
          placeholder="JSON"
          rows={20}
          cols={20}
          onChange={this.handleOnChange}
          value={this.props.sourceText}
        />
        <Button color='primary' onClick={this.handleOnFormatClick}>format</Button>
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
