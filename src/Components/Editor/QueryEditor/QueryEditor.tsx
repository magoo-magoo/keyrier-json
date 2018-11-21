import * as React from 'react';
import { connect } from 'react-redux';

import { UpdateQueryAction, updateQuery } from '../../../Actions/actions';
import { RootState } from '../../../State/State';
import { AceEditor } from '../../Deferred/DeferredAceEditor';
import { getQueryText } from '../../../Store/selectors';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from '../../Deferred/DeferredReactstrap';

interface Props {
  onChange: (e: string) => UpdateQueryAction;
  queryText: string;
}

export const QueryEditor: React.SFC<Props> = ({ onChange, queryText }) => {
  const [modeOpen, setModeOpen] = React.useState(false);
  return (
    <>
      <div className="row">
        <div className="col">
          <h3>Type your query:</h3>
        </div>
      </div>
      <div className="row">
        <div className="px-0">
          <ButtonDropdown
            isOpen={modeOpen}
            toggle={() => setModeOpen(!modeOpen)}
          >
            <DropdownToggle caret>Mode</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Choose a predefined query</DropdownItem>
              <DropdownItem disabled>Javascript</DropdownItem>
              <DropdownItem disabled>SQL like</DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <div className="col pl-0">
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
