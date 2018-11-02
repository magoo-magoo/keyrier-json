import * as React from "react";
import { connect } from "react-redux";

import { UpdateSource, updateSource } from "../../../Actions/actions";
import { jsonBeautify } from "../../../helpers/json";
import { AppState } from "../../../State/State";
import ImportMenu from "./ImportMenu";
import { AceEditor } from "../../Deferred/DeferredAceEditor";

interface Props {
  onChange: (val: string) => UpdateSource;
  sourceText: string;
}

export const SourceEditor: React.SFC<Props> = ({ onChange, sourceText }) => (
  <React.Fragment>
    <div className="row">
      <div className="col-sm-10 offset-sm-2">
        <h3>paste your JSON:</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-2">
        <ImportMenu />
      </div>
      <div className="col-sm-10">
        <AceEditor
          mode="json"
          theme="monokai"
          name="sourceAceEditor"
          onChange={onChange}
          fontSize={18}
          cursorStart={1}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={jsonBeautify(sourceText)}
          minLines={10}
          maxLines={20}
          wrapEnabled={true}
          // debounceChangePeriod={2000}
          setOptions={{
            showLineNumbers: true,
          }}
          editorProps={{ $blockScrolling: Infinity }}
          width={"100%"}
        />
      </div>
    </div>
  </React.Fragment>
);

const mapStateToProps = (state: Readonly<AppState>) => ({
  sourceText: state.rootReducer.source.text,
});

export default connect(
  mapStateToProps,
  { onChange: updateSource }
)(SourceEditor);
