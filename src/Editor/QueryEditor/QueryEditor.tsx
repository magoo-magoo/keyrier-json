import * as React from "react";
import { connect } from "react-redux";
import { Input } from "reactstrap";
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

class QueryEditor extends React.Component<IProps> {
  public render() {
    return (
      <div className="QueryEditor">
       <div>
          <h5>Type your query:</h5>
        {/* <Input
          name="textarea"
          type="textarea"
          onChange={this.handleOnChange}
          value={this.props.queryText}
          placeholder="Query"
          rows={5}
        /> */}
           <AceEditor
          mode="javascript"
          theme="monokai"
          name="blah2"
          onChange={this.handleOnChange}
          fontSize={18}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={this.props.queryText}
          minLines={5}
          maxLines={25}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2
          }}
          width={'100%'}

        />

        </div>
      </div>
    );
  }
  private handleOnChange = (content: string) =>
    this.props.onChange(content);
}

const mapStateToProps = (state: IAppState) => ({
  queryText: state.rootReducer.query.text
});
 
export default connect(
  mapStateToProps,
  { onChange: updateQuery }
)(QueryEditor);
