import * as React from 'react'
import { getOutputObject, getOutputSearchTerm, getOutputSearchMatch, getOutputObjectSize } from 'store/selectors'
import { RootState } from 'state/State'
import { connect } from 'react-redux'
import { DebounceInput } from 'react-debounce-input'
import { updateSearchTerm } from 'actions/actions'
import { Suspense, lazy, memo, useCallback, FC } from 'react'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import deepEqual from 'fast-deep-equal'
const ReactJson = lazy(() => import(/* webpackChunkName: "react-json-view" */ 'react-json-view'))

interface Props {
    src: object | null
    searchTerm: string | undefined
    match: boolean
    onSearchChange: typeof updateSearchTerm
    size: number
}

const errorStyles = { border: '3px solid red' }

const noop = () => null

const JsonView: FC<Props> = ({ src, searchTerm, onSearchChange, match, size }) => {
    const isTooBig = size > 10000000000000
    const handlechange = useCallback(e => onSearchChange(e.target.value), [onSearchChange])
    return (
        <div id="jsonView">
            <DebounceInput
                style={searchTerm && searchTerm !== '' && !match ? errorStyles : {}}
                value={searchTerm}
                className="form-control"
                onChange={handlechange}
                debounceTimeout={500}
                placeholder="Type your search term..."
            />
            <Suspense fallback={<div>Loading...</div>}>
                {isTooBig ? (
                    <></>
                ) : (
                    <ReactJson
                        src={src ? src : {}}
                        name="data"
                        iconStyle="triangle"
                        indentWidth={8}
                        onAdd={noop}
                        onDelete={noop}
                        onEdit={noop}
                        onSelect={noop}
                    />
                )}
            </Suspense>
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        src: getOutputObject(state),
        searchTerm: getOutputSearchTerm(state),
        match: getOutputSearchMatch(state),
        size: getOutputObjectSize(state),
    }
}

export default connect(
    mapStateToProps,
    { onSearchChange: updateSearchTerm }
)(withErrorBoundary(memo(JsonView, (prev, next) => deepEqual(prev, next))))
