import * as React from 'react'
import { connect } from 'react-redux'
import { updateSource } from 'actions/actions'
import { RootState } from 'state/State'
import ImportMenu from './LateralMenu'
import { AceEditor } from 'components/common/DeferredAceEditor'
import { getSourceText, getEditorTheme } from 'store/selectors'
import { memo, FC } from 'react'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { EditorTheme } from 'themes/themes'

interface Props {
  onChange: typeof updateSource
  sourceText: string
  currentEditorTheme: EditorTheme
}

const SourceEditor: FC<Props> = ({ onChange, sourceText, currentEditorTheme }) => (
  <>
    <div className="row">
      <div className="col-sm-10 offset-sm-2">
        <h3>1. Paste your JSON:</h3>
      </div>
    </div>
    <div className="row">
      <div className="col-sm-2">
        <ImportMenu />
      </div>
      <div className="col-sm-10">
        <AceEditor
          mode="json"
          theme={currentEditorTheme}
          name="sourceAceEditor"
          onChange={onChange}
          fontSize={13}
          cursorStart={1}
          showPrintMargin={false}
          showGutter={true}
          highlightActiveLine={true}
          value={sourceText}
          debounceChangePeriod={1000}
          minLines={35}
          maxLines={35}
          enableBasicAutocompletion={false}
          enableLiveAutocompletion={false}
          wrapEnabled={false}
          setOptions={{
            showLineNumbers: true,
          }}
          editorProps={{ $blockScrolling: Infinity }}
          annotations={[]}
          width={'100%'}
        />
      </div>
    </div>
  </>
)

const mapStateToProps = (state: RootState) => ({
  sourceText: getSourceText(state),
  currentEditorTheme: getEditorTheme(state),
})

export default connect(
  mapStateToProps,
  { onChange: updateSource }
)(withErrorBoundary(memo(SourceEditor)))
