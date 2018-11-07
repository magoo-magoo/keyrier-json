import * as React from 'react';
import './Editor.css';
import Output from './Output/Output';
import QueryEditor from './QueryEditor/QueryEditor';
import SourceEditor from './SourceEditor/SourceEditor';

export const Editor = () => (
  <>
    <h1 className="my-5">Paste your JSON and Query it.</h1>
    <div className="row my-5">
      <div className="col">
        <SourceEditor />
      </div>
    </div>
    <div className="row my-5">
      <div className="col">
        <QueryEditor />
      </div>
    </div>
    <div className="row my-5">
      <div className="col">
        <Output />
      </div>
    </div>
  </>
);

export default Editor;
