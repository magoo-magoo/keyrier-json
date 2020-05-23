import { updateSource } from 'actions/actions'
import { AceEditor } from 'components/common/DeferredAceEditor'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { withPerformance } from 'core/logging/performance'
import * as React from 'react'
import { FC, memo, useCallback } from 'react'
import { connect } from 'react-redux'
import { unstable_IdlePriority, unstable_runWithPriority } from 'scheduler'
import { RootState } from 'state/State'
import { getEditorTheme, getSourceText } from 'store/selectors'
import { EditorTheme } from 'themes/themes'

interface Props {
    onChange: typeof updateSource
    sourceText: string
    currentEditorTheme: EditorTheme
}

const SourceEditor: FC<Props> = ({ onChange, sourceText, currentEditorTheme }) => {
    const onChangeCallback = useCallback(
        (s: string) => {
            if (sourceText !== s) {
                unstable_runWithPriority(unstable_IdlePriority, () => onChange(s))
            }
        },
        [onChange, sourceText]
    )
    return (
        <>
            <AceEditor
                mode="json"
                theme={currentEditorTheme}
                name="sourceAceEditor"
                onChange={onChangeCallback}
                value={sourceText}
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    sourceText: getSourceText(state),
    currentEditorTheme: getEditorTheme(state),
})

export default connect(mapStateToProps, { onChange: updateSource })(
    withErrorBoundary(memo(withPerformance(SourceEditor, 'SourceEditor')))
)
