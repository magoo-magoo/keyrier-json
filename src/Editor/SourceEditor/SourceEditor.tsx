import * as React from "react";

class SourceEditor extends React.Component {
  public render() {
    return (
      <div className="SourceEditor">
        <p>paste your JSON: </p>
        <textarea name="textarea" placeholder="JSON" rows={10} cols={50}/>
      </div>
    );
  }
}

export default SourceEditor;
