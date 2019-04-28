import * as React from 'react'
import { connect } from 'react-redux'
import { updateSource } from 'actions/actions'
import { RootState } from 'state/State'
import { AceEditor } from 'components/common/DeferredAceEditor'
import { getSourceText, getEditorTheme } from 'store/selectors'
import { memo, FC, useCallback } from 'react'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { EditorTheme } from 'themes/themes'
import { unstable_runWithPriority, unstable_UserBlockingPriority } from 'scheduler'

interface Props {
  onChange: typeof updateSource
  sourceText: string
  currentEditorTheme: EditorTheme
}

const SourceEditor: FC<Props> = ({ onChange, sourceText, currentEditorTheme }) => {
  const onChangeCallback = useCallback(
    (s: string) => {
      if (sourceText !== s) {
        unstable_runWithPriority(unstable_UserBlockingPriority, () => onChange(s))
      }
    },
    [onChange, sourceText]
  )
  return (
    <>
      <h3>1. Paste your JSON:</h3>
      <AceEditor
        mode="json"
        theme={currentEditorTheme}
        name="sourceAceEditor"
        onChange={onChangeCallback}
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
    </>
  )
}

const mapStateToProps = (state: RootState) => ({
  sourceText: getSourceText(state),
  currentEditorTheme: getEditorTheme(state),
})

export default connect(
  mapStateToProps,
  { onChange: updateSource }
)(withErrorBoundary(memo(SourceEditor)))
