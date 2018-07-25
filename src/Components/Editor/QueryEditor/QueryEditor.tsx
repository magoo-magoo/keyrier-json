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
import { ActionValue, updateQuery } from "../../../Actions/Actions";
import { IAppState } from "../../../State/State";

interface IProps {
  onChange: (e: string) => ActionValue<string>;
  queryText: string;
}

export class QueryEditor extends React.Component<IProps> {
  public render() {
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
            </Col>
          </Row>
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
