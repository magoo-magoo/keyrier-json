import Actions from 'actions/actions'
import deepEqual from 'fast-deep-equal'
import * as React from 'react'
import { FC, lazy, memo, Suspense, useCallback, useState } from 'react'
import { DebounceInput } from 'react-debounce-input'
import { connect } from 'react-redux'
import { CustomInput, FormGroup, Label } from 'reactstrap'
import { withErrorBoundary } from '../../components/common/ErrorBoundary'
import { prettyPrintBytes } from '../../core/converters/string'
import { withPerformance } from '../../core/logging/performance'
import { RootState } from '../../state/State'
import { getDebugMode, getOutputObject, getOutputObjectSize, getOutputSearchMatch, getOutputSearchTerm } from '../../store/selectors'
const ReactJson = lazy(() => import(/* webpackChunkName: "react-json-view" */ 'react-json-view'))

interface Props {
    src: object | null
    searchTerm: string | undefined
    match: boolean
    onSearchChange: typeof Actions.updateSearchTerm
    size: number
    debugMode: boolean
}

const errorStyles = { border: '3px solid red' }

const noop = () => null

const JsonView: FC<Props> = ({ src, searchTerm, onSearchChange, match, size, debugMode }) => {
    const [bigSize, setBigSize] = useState(4683932)
    const isTooBig = size > bigSize
    const handlechange = useCallback((e) => onSearchChange(e.target.value), [onSearchChange])
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
                {debugMode ? (
                    <FormGroup>
                        <Label for="exampleCustomRange">heavy object size: {prettyPrintBytes(bigSize)}</Label>
                        <CustomInput
                            type="range"
                            id="exampleCustomRange"
                            name="customRange"
                            value={bigSize}
                            steps={1024 * 100}
                            min={1024 * 100}
                            max={1024 * 1024}
                            onChange={(e) => setBigSize(parseInt(e.currentTarget.value, 10))}
                        />
                    </FormGroup>
                ) : (
                    <></>
                )}
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
        debugMode: getDebugMode(state),
    }
}

export default connect(mapStateToProps, { onSearchChange: Actions.updateSearchTerm })(
    withErrorBoundary(memo(withPerformance(JsonView, 'JsonView'), (prev, next) => deepEqual(prev, next))),
)
