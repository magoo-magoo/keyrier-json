import * as React from 'react';
import './Editor.css';
import Output from './Output/Output';
import SourceEditor from './SourceEditor/SourceEditor';
import QueryEditor from './QueryEditor/QueryEditor';
import { Button, Collapse } from 'reactstrap';
import { useState } from 'react';

export const Editor = () => {
  const [collapse, setCollapse] = useState(false);
  return (
    <>
      <h1 className="my-5">Paste your JSON and Query it.</h1>
      <div className="row my-5">
        <div className="col">
          <SourceEditor />
        </div>
      </div>
      <div className="row align-items-center my-5">
        <div className="col-md-2">
          <Button color="primary" onClick={() => setCollapse(!collapse)}>
            Modify query
          </Button>
        </div>
        <div className="col-md-10">
          <Collapse isOpen={collapse}>
            <QueryEditor />
          </Collapse>
        </div>
      </div>
      <div className="row my-5">
        <div className="col">
          <Output />
        </div>
      </div>
    </>
  );
};

export default Editor;
