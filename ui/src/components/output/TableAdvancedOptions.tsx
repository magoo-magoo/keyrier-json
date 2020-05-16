import { toggleOutputTableModal, updateTableColumns, updateTableGroupBy } from 'actions/actions'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import Loading from 'components/common/Loading'
import { withPerformance } from 'core/logging/performance'
import { useToggleState } from 'hooks/hooks'
import _ from 'lodash'
import * as React from 'react'
import { ChangeEvent, FC, lazy, memo, Suspense, useCallback } from 'react'
import { connect } from 'react-redux'
import { ValueType } from 'react-select'
import { Button, Collapse } from 'reactstrap'
import { itemType, RootState } from 'state/State'
import { getColumns, getdisplayedColumns, getGroupBy, getOutputarray } from 'store/selectors'

export const ReactSelect = lazy(() => import(/* webpackChunkName: "react-select" */ 'react-select'))

interface Props {
    data: itemType[]
    displayedColumns: string[]
    groupBy: string[]
    columns: string[]
    onColumnsChange: typeof updateTableColumns
    setTableGroupBy: typeof updateTableGroupBy
    toggleModal: typeof toggleOutputTableModal
}

const TableAdvancedOptions: FC<Props> = ({
    onColumnsChange,
    columns,
    setTableGroupBy,
    data,
    displayedColumns,
    toggleModal,
}) => {
    const [optionsCollapsed, switchOptionsCollapsed] = useToggleState()

    const handleColumnChange = useCallback(
        (cols: ValueType<{}> | undefined | null) => {
            if (cols instanceof Array) {
                const mapped = cols.map((c: { value?: string }) => (c.value ? c.value : ''))
                onColumnsChange(mapped)
            }
        },
        [onColumnsChange]
    )

    const handleExport = useCallback(async () => {
        const xlsx = await import(/* webpackChunkName: "xlsx.js" */ 'xlsx')
        const workBook = xlsx.utils.book_new()
        const workSheet = xlsx.utils.json_to_sheet(
            data.map(x => _.pick(x, displayedColumns)),
            {
                header: displayedColumns,
            }
        )
        xlsx.utils.book_append_sheet(workBook, workSheet, 'keyrier-json')
        xlsx.writeFile(workBook, `export-${new Date().toISOString()}.xlsx`)
    }, [displayedColumns, data])

    const handleGroupChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => setTableGroupBy([e.target.value]), [
        setTableGroupBy,
    ])

    if (columns.length <= 0) {
        return null
    }

    const columnOptions = columns.map(k => ({ value: k, label: k }))

    return (
        <div className="row py-1 justify-content-center">
            <div className={`${optionsCollapsed ? 'col-5' : 'col-3'}`}>
                <Button className={'float-left col my-1'} color="primary" block={true} onClick={switchOptionsCollapsed}>
                    {optionsCollapsed ? 'Hide advanced options' : 'Advanced options'}
                </Button>
                <Collapse isOpen={optionsCollapsed}>
                    <select
                        className="form-control-lg form-control"
                        name="select"
                        id="groupingSelect"
                        onChange={handleGroupChange}
                    >
                        <option key={'Group by...'}>Group by...</option>
                        {displayedColumns.map(key => (
                            <option key={key}>{key}</option>
                        ))}
                    </select>
                    <Button className="col my-1" color={'success'} onClick={handleExport}>
                        Export to Excel (.xlsx)
                    </Button>
                    <Button className="col my-1" block={true} color="dark" outline={true} onClick={toggleModal}>
                        Display results table fullscreen
                    </Button>
                    <Suspense fallback={<Loading componentName="ReactSelect" />}>
                        <ReactSelect
                            options={columnOptions}
                            value={displayedColumns.map(k => ({
                                value: k,
                                label: k,
                            }))}
                            isMulti={true}
                            onChange={handleColumnChange}
                        />
                    </Suspense>
                </Collapse>
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        data: getOutputarray(state),
        displayedColumns: getdisplayedColumns(state),
        columns: getColumns(state),
        groupBy: getGroupBy(state),
    }
}

export default connect(mapStateToProps, {
    onColumnsChange: updateTableColumns,
    setTableGroupBy: updateTableGroupBy,
    toggleModal: toggleOutputTableModal,
})(memo(withErrorBoundary(withPerformance(TableAdvancedOptions, 'TableAdvancedOptions'))))
