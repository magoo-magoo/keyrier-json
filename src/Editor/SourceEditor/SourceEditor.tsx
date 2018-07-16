import * as React from "react";
import { ChangeEvent } from "react";

class SourceEditor extends React.Component {
  public render() {
    return (
      <div className="SourceEditor">
        <p>paste your JSON: </p>
        <textarea
          name="textarea"
          placeholder="JSON"
          rows={10}
          cols={50}
          onChange={this.onChange}
        />
      </div>
    );
  }
  private onChange = (event: ChangeEvent<{ value: string }>) => {
    // tslint:disable-next-line:no-console
    console.log(event.target.value);
  };
}

export default SourceEditor;
