import * as React from "react";
import { connect } from "react-redux";

// Order matter for Ace editor
// tslint:disable-next-line:ordered-imports
import AceEditor from "react-ace";
// tslint:disable-next-line:ordered-imports
import "brace/mode/javascript";
// tslint:disable-next-line:ordered-imports
import "brace/theme/monokai";

import { Col, Row } from "reactstrap";
import { IUpdateQueryAction, updateQuery } from "../../../Actions/Actions";
import { IAppState } from "../../../State/State";

interface IProps {
  onChange: (e: string) => IUpdateQueryAction;
  queryText: string;
}

export const QueryEditor: React.SFC<IProps> = (props: IProps) => {
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
            <AceEditor
              mode="javascript"
              theme="monokai"
              name="queryAceEditor"
              onChange={props.onChange}
              fontSize={18}
              highlightActiveLine={true}
              value={props.queryText}
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

const mapStateToProps = (state: Readonly<IAppState>) => ({
  queryText: state.rootReducer.query.text
});

export default connect(
  mapStateToProps,
  { onChange: updateQuery }
)(QueryEditor);
