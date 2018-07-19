import * as React from "react";
import { connect } from "react-redux";
import { Input } from "reactstrap";
import { updateQuery } from "../../Actions";

interface IProps {
  onChange: any;
  queryText: string;
}

class QueryEditor extends React.Component<IProps> {
  public render() {
    return (
      <div className="QueryEditor">
        <p>Type your query: </p>
        <Input
          name="textarea"
          type="textarea"
          onChange={this.handleOnChange}
          defaultValue={this.props.queryText}
          placeholder="Query"
          rows={5}
        />
      </div>
    );
  }
  private handleOnChange = (event: any) =>
    this.props.onChange(event.target.value);
}

const mapStateToProps = (state: any) => ({
  queryText: state.rootReducer.query.text
});

export default connect(
  mapStateToProps,
  { onChange: updateQuery }
)(QueryEditor);
