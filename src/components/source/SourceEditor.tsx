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
    width: number
    height: number
}

const SourceEditor: FC<Props> = ({ onChange, sourceText, currentEditorTheme, width }) => {
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
                fontSize={16}
                cursorStart={1}
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={true}
                value={sourceText}
                debounceChangePeriod={1000}
                minLines={35}
                maxLines={Infinity}
                wrapEnabled={false}
                setOptions={{
                    showLineNumbers: true,
                    animatedScroll: true,
                }}
                annotations={[]}
                width={`${width}`}
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    sourceText: getSourceText(state),
    currentEditorTheme: getEditorTheme(state),
})

const ConnectedSourceEditor = connect(mapStateToProps, { onChange: updateSource })(
    withErrorBoundary(memo(withPerformance(SourceEditor, 'SourceEditor')))
)

export default ConnectedSourceEditor
