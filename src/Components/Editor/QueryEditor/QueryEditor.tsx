import * as React from 'react';
import { connect } from 'react-redux';

import {
  UpdateQueryAction,
  updateQuery,
  updateQueryMode,
  UpdateQueryMode,
} from '../../../Actions/actions';
import { RootState, QueryMode } from '../../../State/State';
import { AceEditor } from '../../Deferred/DeferredAceEditor';
import { getQueryText, getQueryMode } from '../../../Store/selectors';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from '../../Deferred/DeferredReactstrap';

interface Props {
  onChange: (e: string) => UpdateQueryAction;
  updateQueryMode: (e: QueryMode) => UpdateQueryMode;
  queryText: string;
  mode: QueryMode;
}

export const QueryEditor: React.SFC<Props> = ({
  onChange,
  queryText,
  mode,
  updateQueryMode,
}) => {
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
              <DropdownItem
                active={mode === 'Javascript'}
                onClick={() => updateQueryMode('Javascript')}
              >
                Javascript
              </DropdownItem>
              <DropdownItem
                active={mode === 'SQL'}
                onClick={() => updateQueryMode('SQL')}
              >
                SQL like(experimental)
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <div className="col pl-0">
          <AceEditor
            mode={mode === 'Javascript' ? 'javascript' : 'mysql'}
            theme="monokai"
            name="queryAceEditor"
            onChange={onChange}
            fontSize={18}
            highlightActiveLine={true}
            value={queryText}
            minLines={10}
            maxLines={25}
            editorProps={{
              $blockScrolling: Infinity,
            }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              enableSnippets: true,
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              dragEnabled: true,
              debounceChangePeriod: 500,
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
  mode: getQueryMode(state),
});

export default connect(
  mapStateToProps,
  { onChange: updateQuery, updateQueryMode }
)(QueryEditor);
