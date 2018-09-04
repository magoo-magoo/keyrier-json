import * as React from "react";
import { connect } from "react-redux";

import { Col, Row } from "reactstrap";
import { UpdateQueryAction, updateQuery } from "../../../Actions/actions";
import { AppState } from "../../../State/State";
import { LoadableAce } from "../AceEditor";

interface Props {
  onChange: (e: string) => UpdateQueryAction;
  queryText: string;
}

export const QueryEditor: React.SFC<Props> = ({ onChange, queryText }) => {
  return (
    <div className="QueryEditor">
      <div>
        <Row>
          <Col sm={{ size: 10, offset: 2 }}>
            <h5>Type your query:</h5>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 10, offset: 2 }}>
            <LoadableAce
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
                tabSize: 2
              }}
              width={"100%"}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = (state: Readonly<AppState>) => ({
  queryText: state.rootReducer.query.text
});

export default connect(
  mapStateToProps,
  { onChange: updateQuery }
)(QueryEditor);
