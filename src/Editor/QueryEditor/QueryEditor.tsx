import * as React from "react";
import { connect } from "react-redux";
import { ActionValue, updateQuery } from "../../Actions";
import { IAppState } from "../../State";

import AceEditor from "react-ace";
// tslint:disable-next-line:ordered-imports
import "brace/theme/monokai";
// tslint:disable-next-line:ordered-imports
import "brace/mode/javascript";

interface IProps {
  onChange: (e: string) => ActionValue<string>;
  queryText: string;
}

export class QueryEditor extends React.Component<IProps> {
  public render() {
    return (
      <div className="QueryEditor">
        <div>
          <h5>Type your query:</h5>
          <AceEditor
            mode="javascript"
            theme="monokai"
            name="queryAceEditor"
            onChange={this.handleOnChange}
            fontSize={18}
            highlightActiveLine={true}
            value={this.props.queryText}
            minLines={10}
            maxLines={25}
            editorProps={{ $blockScrolling: Infinity }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2
            }}
            width={"100%"}
          />
        </div>
      </div>
    );
  }
  private handleOnChange = (content: string) => this.props.onChange(content);
}

const mapStateToProps = (state: IAppState) => ({
  queryText: state.rootReducer.query.text
});

export default connect(
  mapStateToProps,
  { onChange: updateQuery }
)(QueryEditor);
