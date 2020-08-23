import { withErrorBoundary } from 'components/common/ErrorBoundary'
import Loading from 'components/common/Loading'
import { withPerformance } from 'core/logging/performance'
import deepEqual from 'fast-deep-equal'
import { arrayElementName } from 'models/array'
import * as React from 'react'
import { FC, memo, Suspense, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { Cell, Row, useFilters, usePagination, useSortBy, useTable } from 'react-table'
import { Button, ButtonGroup } from 'reactstrap'
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
    const {
        headerGroups,
        // rows,
        prepareRow,

        pageOptions,
        page,
        state: { pageIndex },
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
    } = useTable(
        {
            columns,
            data: tableData,
        },
        useFilters,
        useSortBy,
        usePagination,
    ) as any
    console.log('page.length', page.length)
    if (
        !tableData ||
        !Array.isArray(tableData) ||
        tableData.length === 0 ||
        tableData.every((e) => e === null || e === undefined || (typeof e === 'object' && Object.keys(e).length === 0))
    ) {
        return <NumberOfElements count={tableData.length} />
    }
    return (
        <div className="d-flex flex-column overflow-hidden mb-2">
            <div className="d-flex">
                <TableAdvancedOptions />
            </div>
            <Suspense fallback={<Loading componentName="ReactTable" />}>
                <table role="grid" className="table table-bordered table-hover table-responsive data-test-id-output-table flex-grow-1">
                    <thead>
                        {headerGroups.map((headerGroup: any, hi: number) => (
                            <tr key={hi}>
                                <th scope="col" className="shadow-sm text-capitalize text-center data-test-id-column-name"></th>
                                {headerGroup.headers.map((column: any, ci: number) => (
                                    <th
                                        key={ci}
                                        scope="col"
                                        className="shadow-sm text-capitalize text-center data-test-id-column-name min-vw-10"
                                        style={{ minWidth: '20vh' }}
                                    >
                                        <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                                            {column.render('header')}
                                            <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                                        </div>

                                        {column.render('Filter')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {page.map((row: Row, i: number) => {
                            prepareRow(row)
                            return (
                                <tr key={i}>
                                    <th scope="row">
                                        <button onClick={() => setDetailsCellValue(row.original)} className="btn btn-link">
                                            <i className="material-icons">open_in_browser</i>
                                        </button>
                                    </th>
                                    {row.cells.map((cell: Cell) => (
                                        <TableCellComponent key={cell.column.id} cell={cell} onClick={setDetailsCellValue} />
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="d-flex align-items-center">
                    <ButtonGroup hidden={pageOptions.length < 2}>
                        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                            Previous Page
                        </Button>
                        <Button onClick={() => nextPage()} disabled={!canNextPage}>
                            Next Page
                        </Button>
                    </ButtonGroup>
                    <div className="ml-2">{`Page ${(pageIndex as number) + 1} of ${pageOptions.length}`}</div>
                    <div className="ml-auto align-items-center justify-content-end d-flex">
                        <NumberOfElements count={tableData.length} />
                    </div>
                </div>
            </Suspense>
            <TableDetailModal value={detailsCellValue} onClose={onCloseDetailModal} />
        </div>
    )
}

const NumberOfElements: FC<{ count: number }> = ({ count }) => (
    <div id="data-test-id-output-table-length">
        <h4>Number of elements: {count}</h4>
    </div>
)
const mapStateToProps = (state: RootState) => ({
    data: getOutputarray(state),
    displayedColumns: getdisplayedColumns(state),
    columns: getColumns(state),
    groupBy: getGroupBy(state),
})

export default connect(mapStateToProps)(
    withErrorBoundary(memo(withPerformance(OutputTableView, 'OutputTableView'), (prev, next) => deepEqual(prev, next))),
)
