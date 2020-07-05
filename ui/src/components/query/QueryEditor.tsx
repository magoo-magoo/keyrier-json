import Actions from 'actions/actions'
import { AceEditor } from 'components/common/DeferredAceEditor'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { withPerformance } from 'core/logging/performance'
import * as React from 'react'
import { FC, memo, useCallback } from 'react'
import { connect } from 'react-redux'
import { unstable_IdlePriority, unstable_runWithPriority } from 'scheduler'
import { QueryMode, RootState } from 'state/State'
import { getEditorTheme, getQueryMode, getQueryText } from 'store/selectors'
import { EditorTheme } from 'themes/themes'

interface Props {
    setQuery: typeof Actions.updateQuery
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
                value={queryText}
            />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    queryText: getQueryText(state),
    mode: getQueryMode(state),
    currentEditorTheme: getEditorTheme(state),
})

export default connect(mapStateToProps, { setQuery: Actions.updateQuery })(
    withErrorBoundary(memo(withPerformance(QueryEditor, 'QueryEditor')))
)
