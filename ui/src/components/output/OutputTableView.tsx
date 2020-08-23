import { withErrorBoundary } from 'components/common/ErrorBoundary'
import Loading from 'components/common/Loading'
import { withPerformance } from 'core/logging/performance'
import deepEqual from 'fast-deep-equal'
import { arrayElementName } from 'models/array'
import * as React from 'react'
import { FC, memo, Suspense, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { useFilters, useSortBy, useTable } from 'react-table'
import { itemType, RootState } from 'state/State'
import { getColumns, getdisplayedColumns, getGroupBy, getOutputarray } from 'store/selectors'

import { DefaultColumnFilter } from './DefaultColumnFilter'
import TableAdvancedOptions from './TableAdvancedOptions'
import { TableCellComponent } from './TableCellComponent'
import { TableDetailModal } from './TableDetailModal'

type Props = {
    data: itemType[]
    displayedColumns: string[]
}
const OutputTableView: FC<Props> = ({ data, displayedColumns }) => {
    const [detailsCellValue, setDetailsCellValue] = useState(null as itemType | null)
    const tableData = useMemo(() => data.map((e) => (!!e ? (typeof e === 'object' ? e : { [arrayElementName]: e }) : {})), [data])
    const columns = React.useMemo(
        () =>
            displayedColumns.map((name) => {
                return {
                    header: name,
                    accessor: name,
                    Filter: DefaultColumnFilter,
                }
            }),
        [displayedColumns],
    )

    const onCloseDetailModal = () => setDetailsCellValue(null)
    const { headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data: tableData,
        },
        useFilters,
        useSortBy,
    )
    if (
        !tableData ||
        !Array.isArray(tableData) ||
        tableData.length === 0 ||
        tableData.every((e) => e === null || e === undefined || (typeof e === 'object' && Object.keys(e).length === 0))
    ) {
        return <div />
    }

    return (
        <div className="d-flex flex-column overflow-hidden">
            <div className="d-flex">
                <TableAdvancedOptions />
            </div>
            <Suspense fallback={<Loading componentName="ReactTable" />}>
                <table role="grid" className="table table-bordered table-hover table-responsive data-test-id-output-table">
                    <thead>
                        {headerGroups.map((headerGroup, hi) => (
                            <tr key={hi}>
                                <th scope="col" className="shadow-sm text-capitalize text-center data-test-id-column-name"></th>
                                {headerGroup.headers.map((column, ci) => (
                                    <th
                                        key={ci}
                                        scope="col"
                                        className="shadow-sm text-capitalize text-center data-test-id-column-name min-vw-10"
                                        style={{ minWidth: '20vh' }}
                                    >
                                        <div {...column.getHeaderProps((column as any).getSortByToggleProps())}>
                                            {column.render('header')}
                                            <span>{(column as any).isSorted ? ((column as any).isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                                        </div>

                                        {column.render('Filter')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {rows.map((row, i) => {
                            prepareRow(row)
                            return (
                                <tr key={i}>
                                    <th scope="row">
                                        <button onClick={() => setDetailsCellValue(row.original)} className="btn btn-link">
                                            <i className="material-icons">open_in_browser</i>
                                        </button>
                                    </th>
                                    {row.cells.map((cell) => (
                                        <TableCellComponent key={cell.column.id} cell={cell} onClick={setDetailsCellValue} />
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </Suspense>
            <div id="data-test-id-output-table-length" className="mx-3 align-items-center justify-content-end d-flex">
                <h4>Number of elements: {tableData.length}</h4>
            </div>
            <TableDetailModal value={detailsCellValue} onClose={onCloseDetailModal} />
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

export default connect(mapStateToProps)(
    withErrorBoundary(memo(withPerformance(OutputTableView, 'OutputTableView'), (prev, next) => deepEqual(prev, next))),
)
