import * as React from 'react'
import { connect } from 'react-redux'

import { UpdateQueryAction, updateQuery, updateQueryMode, UpdateQueryMode } from '../../../Actions/actions'
import { RootState, QueryMode } from '../../../State/State'
import { AceEditor } from '../../Deferred/DeferredAceEditor'
import { getQueryText, getQueryMode } from '../../../Store/selectors'
import { useToggleState } from '../../../Hooks/hooks'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { memo, useCallback } from 'react'
import { withErrorBoundary } from '../../Common/ErrorBoundary'
import { unstable_runWithPriority, unstable_IdlePriority } from 'scheduler'

interface Props {
  setQuery: (e: string) => UpdateQueryAction
  setQueryMode: (e: QueryMode) => UpdateQueryMode
  queryText: string
  mode: QueryMode
}

const QueryEditor: React.FC<Props> = ({ setQuery, queryText, mode, setQueryMode }) => {
  const [modeOpen, switchModeOpen] = useToggleState()

  const setJsMode = useCallback(() => setQueryMode('Javascript'), [setQueryMode])
  const setSqlMode = useCallback(() => setQueryMode('SQL'), [setQueryMode])
  const onChange = useCallback(
    (a: string) => {
      unstable_runWithPriority(unstable_IdlePriority, () => setQuery(a))
    },
    [setQuery]
  )

  return (
    <>
      <div className="row">
        <div className="col-sm-10 offset-sm-2">
          <h3>2. Type your query:</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-2">
          <ButtonDropdown isOpen={modeOpen} toggle={switchModeOpen}>
            <DropdownToggle color="primary" caret={true}>
              Mode
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header={true}>Choose a predefined query</DropdownItem>
              <DropdownItem active={mode === 'Javascript'} onClick={setJsMode}>
                Javascript
              </DropdownItem>
              <DropdownItem active={mode === 'SQL'} onClick={setSqlMode}>
                SQL like(experimental)
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <div className="col-sm-10">
          <AceEditor
            mode={mode === 'Javascript' ? 'javascript' : 'mysql'}
            theme="monokai"
            name="queryAceEditor"
            onChange={onChange}
            fontSize={13}
            highlightActiveLine={true}
            value={queryText}
            minLines={10}
            maxLines={25}
            showPrintMargin={false}
            editorProps={{
              $blockScrolling: Infinity,
            }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
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
  { setQuery: updateQuery, setQueryMode: updateQueryMode }
)(withErrorBoundary(memo(QueryEditor)))
