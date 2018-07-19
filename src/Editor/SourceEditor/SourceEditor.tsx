import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Button, Input } from 'reactstrap';
import { formatSourceText, updateSource } from "../../Actions";

interface IProps {
  onChange: any;
  formatText: any;
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

  private handleOnChange = (event: any) =>
    this.props.onChange(event.target.value);

    private handleOnFormatClick = (event: any) =>
    this.props.formatText();    
}

const mapStateToProps = (state: any) => ({
  sourceText: state.rootReducer.source.text
});

export default connect(
  mapStateToProps,
  { onChange: updateSource, formatText: formatSourceText }
)(SourceEditor);
