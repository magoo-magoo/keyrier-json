import * as React from 'react'
import { customToString, containsIgnoreCase } from 'core/converters/string'
import { connect } from 'react-redux'
import TableAdvancedOptions from './TableAdvancedOptions'
import { Column, Filter, RowInfo } from 'react-table'
import { itemType, RootState } from 'state/State'
import { getdisplayedColumns, getColumns, getGroupBy, getOutputarray } from 'store/selectors'
import { useState, Suspense, lazy, memo, useCallback, FC } from 'react'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { Modal, ModalProps, ModalHeader, ModalBody } from 'reactstrap'
import deepEqual from 'fast-deep-equal'

import 'react-table/react-table.css'
import { Loading } from 'components/common/Loading'
import { arrayElementName } from 'models/array'

const ReactJson = lazy(() => import(/* webpackChunkName: "react-json-view" */ 'react-json-view'))
const ReactTable = lazy(() => import(/* webpackChunkName: "react-table" */ 'react-table'))

type Props = {
    data: unknown[]
    displayedColumns: string[]
    groupBy?: string[]
}

export const OutputTableView: FC<Props> = ({ data, displayedColumns, groupBy }) => {
    const [detailsCellValue, setDetailsCellValue] = useState(null as itemType | null)

    const getTdProps = useCallback(
        (_: any, rowInfo?: RowInfo, column?: Column | undefined, __?: any) => ({
            onClick: (e: MouseEvent, original: () => void) => {
                if (rowInfo && rowInfo.aggregated) {
                    original()
                } else if (e && column && column.id && rowInfo && rowInfo.row) {
                    setDetailsCellValue(rowInfo.row[column.id])
                }
            },
        }),
        [setDetailsCellValue]
    )

    const handleCloseDetail = useCallback(() => setDetailsCellValue(null), [setDetailsCellValue])

    if (
        !data ||
        !Array.isArray(data) ||
        data.length === 0 ||
        data.every(e => e === null || e === undefined || (typeof e === 'object' && Object.keys(e).length === 0))
    ) {
        return <div />
    }

    const tableColumnConfig = displayedColumns.map(
        key =>
            ({
                Aggregated: () => (row: any) => (row ? row.value : ''),
                Cell: (cellProps: any) => {
                    const cellContent =
                        cellProps !== null && cellProps !== undefined ? customToString(cellProps.value) : ''
                    return cellContent
                },
                Header: key,
                headerClassName: 'data-test-id-column-name',
                accessor: key,
                className: 'text-center btn btn-link data-test-id-cell-data',
            } as const)
    )

    return (
        <>
            <div className="row">
                <div className="col">
                    <TableAdvancedOptions />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Suspense fallback={<Loading componentName="ReactTable" />}>
                        <ReactTable
                            noDataText="FRACKING EMPTY!"
                            className="data-test-id-output-table -highlight"
                            data={data.map(e => (!!e ? (typeof e === 'object' ? e : { [arrayElementName]: e }) : {}))}
                            defaultPageSize={10}
                            columns={tableColumnConfig}
                            filterable={true}
                            pivotBy={groupBy}
                            defaultFilterMethod={defaultFilterMethod}
                            getTdProps={getTdProps}
                        />
                    </Suspense>
                </div>
            </div>
            <div id="data-test-id-output-table-length" className="mx-3 align-items-center justify-content-end d-flex">
                <h4>Number of elements: {data.length}</h4>
            </div>
            <Modal<ModalProps> isOpen={!!detailsCellValue} toggle={handleCloseDetail} size="lg">
                <ModalHeader>Details</ModalHeader>
                <ModalBody>
                    {typeof detailsCellValue === 'object' ? (
                        <Suspense fallback={<Loading componentName="ReactJson" />}>
                            <ReactJson
                                src={detailsCellValue ? detailsCellValue : {}}
                                name="data"
                                iconStyle="triangle"
                                indentWidth={8}
                                onAdd={() => null}
                                onDelete={() => null}
                                onEdit={() => null}
                                onSelect={() => null}
                            />
                        </Suspense>
                    ) : (
                        detailsCellValue
                    )}
                </ModalBody>
            </Modal>
        </>
    )
}

const defaultFilterMethod = (filter: Filter, row: itemType) =>
    filter && row && containsIgnoreCase(customToString(row[filter.id]), filter.value)

const mapStateToProps = (state: RootState) => {
    return {
        data: getOutputarray(state),
        displayedColumns: getdisplayedColumns(state),
        columns: getColumns(state),
        groupBy: getGroupBy(state),
    }
}

export default connect(mapStateToProps)(withErrorBoundary(memo(OutputTableView, (prev, next) => deepEqual(prev, next))))
