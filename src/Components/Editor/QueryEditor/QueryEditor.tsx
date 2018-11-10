import * as React from 'react';
import { connect } from 'react-redux';

import { UpdateQueryAction, updateQuery } from '../../../Actions/actions';
import { RootState } from '../../../State/State';
import { AceEditor } from '../../Deferred/DeferredAceEditor';
import { getQueryText } from '../../../Store/selectors';

interface Props {
  onChange: (e: string) => UpdateQueryAction;
  queryText: string;
}

export const QueryEditor: React.SFC<Props> = ({ onChange, queryText }) => {
  return (
    <>
      <div className="row">
        <div className="col-sm-10 offset-sm-2">
          <h3>Type your query:</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-10 offset-sm-2">
          <AceEditor
            mode="javascript"
            theme="monokai"
            name="queryAceEditor"
            onChange={onChange}
            fontSize={18}
            highlightActiveLine={true}
            value={queryText}
            minLines={10}
            maxLines={25}
            editorProps={{ $blockScrolling: Infinity }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              enableSnippets: true,
              dragEnabled: true,
            }}
            width={'100%'}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: Readonly<RootState>) => ({
  queryText: getQueryText(state),
});

export default connect(
  mapStateToProps,
  { onChange: updateQuery }
)(QueryEditor);