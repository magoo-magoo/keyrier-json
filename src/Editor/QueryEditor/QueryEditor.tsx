import * as React from 'react';

class QueryEditor extends React.Component {
  public render() {
    return (
      <div className="QueryEditor">
        <p>Type your query: </p>
        <textarea name="textarea" placeholder="Query" rows={10} cols={50}/>
      </div>
    );
  }
}

export default QueryEditor;
