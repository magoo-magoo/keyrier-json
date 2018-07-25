import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";

// Order matter for Ace editor
import AceEditor from "react-ace";
// tslint:disable-next-line:ordered-imports
import "brace/theme/monokai";
// tslint:disable-next-line:ordered-imports
import "brace/mode/json";

import { ActionValue, updateSource } from "../../../Actions/Actions";
import { jsonBeautify } from "../../../helpers/json";
import { IAppState } from "../../../State/State";

interface IProps {
  onChange: (val: string) => ActionValue<string>;
  sourceText: string;
}

export class SourceEditor extends Component<IProps> {
  public render() {
    return (
      <div className="SourceEditor">
        <h5>paste your JSON:</h5>
        <AceEditor
          mode="json"
          theme="monokai"
          name="sourceAceEditor"
          onChange={this.handleOnChange}
          fontSize={18}
          cursorStart={1}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={jsonBeautify(this.props.sourceText)}
          minLines={10}
          maxLines={20}
          wrapEnabled={true}
          setOptions={{
            showLineNumbers: true,
            tabSize: 2
          }}
          editorProps={{ $blockScrolling: Infinity }}
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
