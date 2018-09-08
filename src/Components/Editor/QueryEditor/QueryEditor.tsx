import * as React from "react";
import { connect } from "react-redux";

import { Col, Row } from "../../Deferred/DeferredReactstrap";
import { UpdateQueryAction, updateQuery } from "../../../Actions/actions";
import { AppState } from "../../../State/State";
import { AceEditor } from "../../Deferred/DeferredAceEditor";

interface Props {
  onChange: (e: string) => UpdateQueryAction;
  queryText: string;
}

export const QueryEditor: React.SFC<Props> = ({ onChange, queryText }) => {
  return (
    <React.Fragment>
        <Row>
          <Col sm={{ size: 10, offset: 2 }}>
            <h3>Type your query:</h3>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 10, offset: 2 }}>
            <AceEditor
              mode="javascript"
              theme="monokai"
              name="queryAceEditor"
              onChange={onChange}
              fontSize={18}
              highlightActiveLine={true}
              value={queryText}
              minLines={10}
              maxLines={25}
              editorProps={{ $blockScrolling: Infinity }}
              setOptions={{
                showLineNumbers: true,
                tabSize: 2,
                enableSnippets: true,
                dragEnabled: true
              }}
              width={"100%"}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
            />
          </Col>
        </Row>
    </React.Fragment>
  );
};

const mapStateToProps = (state: Readonly<AppState>) => ({
  queryText: state.rootReducer.query.text
});

export default connect(
  mapStateToProps,
  { onChange: updateQuery }
)(QueryEditor);
