import Actions from 'actions/actions'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import Loading from 'components/common/Loading'
import { withPerformance } from 'core/logging/performance'
import { useToggleState } from 'hooks/hooks'
import { pick } from 'lodash-es'
import * as React from 'react'
import { ChangeEvent, FC, lazy, memo, Suspense, useCallback } from 'react'
import { connect } from 'react-redux'
import { OptionTypeBase, ValueType } from 'react-select'
import { Button, Collapse } from 'reactstrap'
import { itemType, RootState } from 'state/State'
import { getColumns, getdisplayedColumns, getGroupBy, getOutputarray } from 'store/selectors'

export const ReactSelect = lazy(() => import(/* webpackChunkName: "react-select" */ 'react-select'))

interface Props {
    data: itemType[]
    displayedColumns: string[]
    groupBy: string[]
    columns: string[]
    onColumnsChange: typeof Actions.updateTableColumns
    setTableGroupBy: typeof Actions.updateTableGroupBy
    toggleModal: typeof Actions.toggleOutputTableModal
}

const TableAdvancedOptions: FC<Props> = ({ onColumnsChange, columns, setTableGroupBy, data, displayedColumns, toggleModal }) => {
    const [optionsCollapsed, switchOptionsCollapsed] = useToggleState()

    const handleColumnChange = useCallback(
        (cols: ValueType<OptionTypeBase> | undefined | null) => {
            if (cols instanceof Array) {
                const mapped = cols.map((c: { value?: string }) => (c.value ? c.value : ''))
                onColumnsChange(mapped)
            }
        },
        [onColumnsChange],
    )

    const handleExport = useCallback(async () => {
        const xlsx = await import(/* webpackChunkName: "xlsx.js" */ 'xlsx')
        const workBook = xlsx.utils.book_new()
        const workSheet = xlsx.utils.json_to_sheet(
            data.map((x) => pick(x, displayedColumns)),
            {
                header: displayedColumns,
            },
        )
        xlsx.utils.book_append_sheet(workBook, workSheet, 'keyrier-json')
        xlsx.writeFile(workBook, `export-${new Date().toISOString()}.xlsx`)
    }, [displayedColumns, data])

    const handleGroupChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => setTableGroupBy([e.target.value]), [setTableGroupBy])

    if (columns.length <= 0) {
        return null
    }

    const columnOptions = columns.map((k) => ({ value: k, label: k }))

    return (
        <div className="d-flex flex-column py-1 justify-content-center w-100">
            <Button className={'float-left  my-1 w-100'} color="primary" block={true} onClick={switchOptionsCollapsed}>
                {optionsCollapsed ? 'Hide advanced options' : 'Advanced options'}
            </Button>
            <Collapse isOpen={optionsCollapsed}>
                <select hidden={true} className="form-control-lg form-control" name="select" id="groupingSelect" onBlur={handleGroupChange}>
                    <option key={'Group by...'}>Group by...</option>
                    {displayedColumns.map((key) => (
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
                        value={displayedColumns.map((k) => ({
                            value: k,
                            label: k,
                        }))}
                        isMulti={true}
                        onChange={handleColumnChange}
                    />
                </Suspense>
            </Collapse>
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
    onColumnsChange: Actions.updateTableColumns,
    setTableGroupBy: Actions.updateTableGroupBy,
    toggleModal: Actions.toggleOutputTableModal,
})(memo(withErrorBoundary(withPerformance(TableAdvancedOptions, 'TableAdvancedOptions'))))
