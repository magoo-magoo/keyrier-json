import * as React from "react";
import { connect } from "react-redux";
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
        <p>Output: </p>
        <pre>
          <code>{this.props.output}</code>
        </pre>
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
