// import 'react-table/react-table.css'

import * as React from 'react'
import { connect } from 'react-redux'
import TableAdvancedOptions from './TableAdvancedOptions'
import { itemType, RootState } from 'state/State'
import { getdisplayedColumns, getColumns, getGroupBy, getOutputarray } from 'store/selectors'
import { useState, Suspense, lazy, memo, FC } from 'react'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { Modal, ModalProps, ModalHeader, ModalBody } from 'reactstrap'
import deepEqual from 'fast-deep-equal'
import Loading from 'components/common/Loading'
import { arrayElementName } from 'models/array'
import { withPerformance } from 'core/logging/performance'
import { useTable, Cell } from 'react-table'
import { customToString, takeFirst } from 'core/converters/string'
const ReactJson = lazy(() => import(/* webpackChunkName: "react-json-view" */ 'react-json-view'))

type CellProps = {
    cell: Cell<any, itemType>
    onClick: (value: itemType) => void
}
const CellComponent: FC<CellProps> = ({ cell, onClick }) => {
    if (!cell) {
        return <></>
    }
    const stringValue = customToString(cell.value)
    const isTooLong = stringValue.length > 50
    const displayValue = isTooLong ? takeFirst(stringValue, 50) : stringValue
    const onCellClick = isTooLong
        ? () => {
              onClick(cell.value)
          }
        : undefined
    return (
        <td onClick={onCellClick} className={`text-center text-nowrap data-test-id-cell-data`}>
            {isTooLong ? <button className="btn">{displayValue}</button> : displayValue}
        </td>
    )
}

type DetailModalProps = {
    value: itemType
    onClose: () => void
}
const DetailModal: FC<DetailModalProps> = ({ value, onClose }) => (
    <Modal<ModalProps> isOpen={!!value} toggle={onClose} size="lg">
        <ModalHeader>Details</ModalHeader>
        <ModalBody>
            {typeof value === 'object' ? (
                <Suspense fallback={<Loading componentName="ReactJson" />}>
                    <ReactJson
                        src={value ? value : {}}
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
                value
            )}
        </ModalBody>
    </Modal>
)

type Props = {
    data: itemType[]
    displayedColumns: string[]
}
export const OutputTableView: FC<Props> = ({ data, displayedColumns }) => {
    const [detailsCellValue, setDetailsCellValue] = useState(null as itemType | null)
    const tableData = data.map(e => (!!e ? (typeof e === 'object' ? e : { [arrayElementName]: e }) : {}))
    const columns = React.useMemo(
        () =>
            displayedColumns.map(name => {
                return {
                    header: name,
                    accessor: name,
                }
            }),
        [displayedColumns]
    )

    const onCloseDetailModal = () => setDetailsCellValue(null)
    const { headerGroups, rows, prepareRow } = useTable({
        columns,
        data: tableData,
    })
    if (
        !data ||
        !Array.isArray(data) ||
        data.length === 0 ||
        data.every(e => e === null || e === undefined || (typeof e === 'object' && Object.keys(e).length === 0))
    ) {
        return <div />
    }

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
                        <table className="table table-bordered table-hover table-responsive data-test-id-output-table">
                            <thead>
                                {headerGroups.map(headerGroup => (
                                    <tr>
                                        <th
                                            scope="col"
                                            className="shadow-sm text-capitalize text-center data-test-id-column-name"
                                        ></th>
                                        {headerGroup.headers.map(column => (
                                            <th
                                                scope="col"
                                                className="shadow-sm text-capitalize text-center data-test-id-column-name"
                                            >
                                                {column.render('header')}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {rows.map(row => {
                                    prepareRow(row)
                                    return (
                                        <tr>
                                            <th scope="row">
                                                <button
                                                    onClick={() => setDetailsCellValue(row.original)}
                                                    className="btn btn-link"
                                                >
                                                    <i className="material-icons">open_in_browser</i>
                                                </button>
                                            </th>
                                            {row.cells.map(cell => (
                                                <CellComponent
                                                    key={cell.column.id}
                                                    cell={cell}
                                                    onClick={setDetailsCellValue}
                                                />
                                            ))}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </Suspense>
                </div>
            </div>
            <div id="data-test-id-output-table-length" className="mx-3 align-items-center justify-content-end d-flex">
                <h4>Number of elements: {data.length}</h4>
            </div>
            <DetailModal value={detailsCellValue} onClose={onCloseDetailModal} />
        </>
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
    withErrorBoundary(memo(withPerformance(OutputTableView, 'OutputTableView'), (prev, next) => deepEqual(prev, next)))
)
