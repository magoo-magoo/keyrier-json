import * as React from "react";
import { connect } from "react-redux";

// Order matter for Ace editor
import AceEditor from "react-ace";
// tslint:disable-next-line:ordered-imports
import "brace/theme/monokai";
// tslint:disable-next-line:ordered-imports
import "brace/mode/json";

import { Col, Row } from "reactstrap";
import { IUpdateSource, updateSource } from "../../../Actions/Actions";
import { jsonBeautify } from "../../../helpers/json";
import { IAppState } from "../../../State/State";
import ImportMenu from "./ImportMenu";

interface IProps {
  onChange: (val: string) => IUpdateSource;
  sourceText: string;
}

export const SourceEditor = (props: IProps) => (
  <div className="SourceEditor">
    <Row>
      <Col sm={{ size: 10, offset: 2 }}>
        <h5>paste your JSON:</h5>
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
          onChange={props.onChange}
          fontSize={18}
          cursorStart={1}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={jsonBeautify(props.sourceText)}
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
      </Col>
    </Row>
  </div>
);

const mapStateToProps = (state: Readonly<IAppState>) => ({
  sourceText: state.rootReducer.source.text
});

export default connect(
  mapStateToProps,
  { onChange: updateSource }
)(SourceEditor);
