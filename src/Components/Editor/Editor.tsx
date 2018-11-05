import * as React from 'react';
import { connect } from 'react-redux';
import { Button } from '../Deferred/DeferredReactstrap';
import { ResetEditor, resetEditor } from '../../Actions/actions';
import './Editor.css';
import Output from './Output/Output';
import QueryEditor from './QueryEditor/QueryEditor';
import SourceEditor from './SourceEditor/SourceEditor';

interface Props {
  onReset: () => ResetEditor;
}

export const Editor: React.SFC<Props> = ({ onReset }) => (
  <>
    <h1>Paste your JSON and Query it.</h1>
    <div className="row">
      <div className="col">
        <Button className="float-right" color="warning" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <SourceEditor />
      </div>
    </div>
    <div className="row">
      <div className="col">
        <QueryEditor />
      </div>
    </div>
    <div className="row">
      <div className="col">
        <Output />
      </div>
    </div>
  </>
);

export default connect(
  null,
  { onReset: resetEditor }
)(Editor);
