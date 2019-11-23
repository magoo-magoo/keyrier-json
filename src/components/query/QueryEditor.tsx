import * as React from 'react'
import { connect } from 'react-redux'

import { updateQuery } from 'actions/actions'
import { RootState, QueryMode } from 'state/State'
import { AceEditor } from 'components/common/DeferredAceEditor'
import { getQueryText, getQueryMode, getEditorTheme } from 'store/selectors'
import { memo, useCallback, FC } from 'react'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { unstable_runWithPriority, unstable_IdlePriority } from 'scheduler'
import { EditorTheme } from 'themes/themes'
import { withPerformance } from 'core/logging/performance'

interface Props {
    setQuery: typeof updateQuery
    queryText: string
    currentEditorTheme: EditorTheme
    mode: QueryMode
}

const QueryEditor: FC<Props> = ({ setQuery, queryText, mode, currentEditorTheme }) => {
    const onChange = useCallback(
        (a: string) => {
            if (queryText !== a) {
                unstable_runWithPriority(unstable_IdlePriority, () => setQuery(a))
            }
        },
        [setQuery, queryText]
    )

    return (
        <>
            <AceEditor
                mode={mode === 'Javascript' ? 'javascript' : 'mysql'}
                theme={currentEditorTheme}
                name="queryAceEditor"
                onChange={onChange}
                fontSize={16}
                highlightActiveLine={true}
                value={queryText}
                minLines={10}
                maxLines={25}
                showPrintMargin={false}
                editorProps={{
                    $blockScrolling: Infinity,
                }}
                setOptions={{
                    dragEnabled: true,
                }}
                width={'100%'}
                debounceChangePeriod={500}
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    queryText: getQueryText(state),
    mode: getQueryMode(state),
    currentEditorTheme: getEditorTheme(state),
})

export default connect(mapStateToProps, { setQuery: updateQuery })(
    withErrorBoundary(memo(withPerformance(QueryEditor, 'QueryEditor')))
)
