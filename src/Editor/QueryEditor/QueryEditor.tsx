import * as React from "react";
import { connect } from "react-redux";
import { CardBody, CardText, CardTitle, Input } from "reactstrap";
import { IActionResultValue, updateQuery } from "../../Actions";
import { IAppState } from "../../State";

interface IProps {
  onChange: (e: string) => IActionResultValue<string>;
  queryText: string;
}

class QueryEditor extends React.Component<IProps> {
  public render() {
    return (
      <div className="QueryEditor">
       <CardBody>
          <CardTitle>Type your query:</CardTitle>
          <CardText>
        <Input
          name="textarea"
          type="textarea"
          onChange={this.handleOnChange}
          defaultValue={this.props.queryText}
          placeholder="Query"
          rows={5}
        />
        </CardText>
        </CardBody>
      </div>
    );
  }
  private handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.props.onChange(event.target.value);
}

const mapStateToProps = (state: IAppState) => ({
  queryText: state.rootReducer.query.text
});
 
export default connect(
  mapStateToProps,
  { onChange: updateQuery }
)(QueryEditor);
