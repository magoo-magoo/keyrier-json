import * as React from 'react';
import './Editor.css';
import Output from './Output/Output';
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
        <Output/>
      </div>
    );
  }
}

export default Editor;
