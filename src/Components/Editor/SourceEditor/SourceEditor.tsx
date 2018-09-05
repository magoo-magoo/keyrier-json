import * as React from "react";
import { connect } from "react-redux";

import { Col, Row } from "../../Deferred/DeferredReactstrap";
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
  <div className="SourceEditor">
    <Row>
      <Col sm={{ size: 10, offset: 2 }}>
        <h3>paste your JSON:</h3>
      </Col>
    </Row>
    <Row>
      <Col sm={2}>
        <ImportMenu />
      </Col>
      <Col sm={10}>
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
            showLineNumbers: true
          }}
          editorProps={{ $blockScrolling: Infinity }}
          width={"100%"}
        />
      </Col>
    </Row>
  </div>
);

const mapStateToProps = (state: Readonly<AppState>) => ({
  sourceText: state.rootReducer.source.text
});

export default connect(
  mapStateToProps,
  { onChange: updateSource }
)(SourceEditor);
