import * as React from 'react'
import { connect } from 'react-redux'

import { UpdateQueryAction, updateQuery, updateQueryMode, UpdateQueryMode } from '../../../Actions/actions'
import { RootState, QueryMode } from '../../../State/State'
import { AceEditor } from '../../Deferred/DeferredAceEditor'
import { getQueryText, getQueryMode } from '../../../Store/selectors'
import { useToggleState } from '../../../Hooks/hooks'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from '../../Deferred/DeferredReactstrap'
import { memo } from 'react'
import { withErrorBoundary } from '../../Common/ErrorBoundary'

interface Props {
  onChange: (e: string) => UpdateQueryAction
  setQueryMode: (e: QueryMode) => UpdateQueryMode
  queryText: string
  mode: QueryMode
}

const QueryEditor: React.FC<Props> = ({ onChange, queryText, mode, setQueryMode }) => {
  const [modeOpen, switchModeOpen] = useToggleState()
  return (
    <>
      <div className="row">
        <div className="col">
          <h3>Type your query:</h3>
        </div>
      </div>
      <div className="row">
        <div className="px-0">
          <ButtonDropdown isOpen={modeOpen} toggle={switchModeOpen}>
            <DropdownToggle caret={true}>Mode</DropdownToggle>
            <DropdownMenu>
              <DropdownItem header={true}>Choose a predefined query</DropdownItem>
              <DropdownItem active={mode === 'Javascript'} onClick={() => setQueryMode('Javascript')}>
                Javascript
              </DropdownItem>
              <DropdownItem active={mode === 'SQL'} onClick={() => setQueryMode('SQL')}>
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
            }}
            width={'100%'}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            debounceChangePeriod={250}
          />
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  queryText: getQueryText(state),
  mode: getQueryMode(state),
})

export default connect(
  mapStateToProps,
  { onChange: updateQuery, setQueryMode: updateQueryMode }
)(memo(withErrorBoundary(QueryEditor)))
