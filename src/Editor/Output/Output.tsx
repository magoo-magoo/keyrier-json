import * as React from "react";
import { connect } from "react-redux";
import { Jumbotron } from "reactstrap";
import { IAppState } from "../../State";

interface IProps {
  output: string;
}

class Output extends React.Component<IProps> {
  constructor(props: { output: string }) {
    super(props);
    this.state = {
      output: props.output
    };
  }
  public render() {
    return (
      <div className="Output">
        <Jumbotron>
          <h3>Output: </h3>
          <pre>
            <code className="jxson">{this.props.output}</code>
          </pre>
        </Jumbotron>
      </div>
    );
  }
}
const mapStateToProps = (state: IAppState) => {
  return {
    output: state.rootReducer.output.text
  };
};

export default connect(mapStateToProps)(Output);
