import * as React from "react";
import { Component } from "react";

import { connect } from "react-redux";
import { ActionValue, updateSource } from "../../Actions";
import { IAppState } from "../../State";

import AceEditor from "react-ace";
// tslint:disable-next-line:ordered-imports
import "brace/theme/monokai";
// tslint:disable-next-line:ordered-imports
import "brace/mode/json";

interface IProps {
  onChange: (val: string) => ActionValue<string>;
  sourceText: string;
}

class SourceEditor extends Component<IProps> {
  public render() {
    return (
      <div className="SourceEditor">
        <h5>paste your JSON:</h5>
        <AceEditor
          mode="json"
          theme="monokai"
          name="blah2"
          onChange={this.handleOnChange}
          fontSize={18}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={this.props.sourceText}
          minLines={10}
          maxLines={20}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2
          }}
          width={"100%"}
        />
      </div>
    );
  }

  private handleOnChange = (content: string) => this.props.onChange(content);

}

const mapStateToProps = (state: IAppState) => ({
  sourceText: state.rootReducer.source.text
});

export default connect(
  mapStateToProps,
  { onChange: updateSource }
)(SourceEditor);
