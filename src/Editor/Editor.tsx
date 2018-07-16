import * as React from 'react';
import './Editor.css';
import QueryEditor from './QueryEditor/QueryEditor';
import SourceEditor from './SourceEditor/SourceEditor';

class Editor extends React.Component {
  public render() {
    return (
      <div className="Editor">
        <h1>
          Paste your JSON and Query it.
        </h1>
        <SourceEditor/>
        <QueryEditor/>
      </div>
    );
  }
}

export default Editor;
