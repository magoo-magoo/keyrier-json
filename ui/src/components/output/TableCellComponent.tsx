import * as React from 'react'
import { FC } from 'react'
import { Cell } from 'react-table'

import { customToString, takeFirst } from '../../core/converters/string'
import { itemType } from '../../state/State'

type CellProps = {
    cell: Cell<any, itemType>
    onClick: (value: itemType) => void
}

export const TableCellComponent: FC<CellProps> = ({ cell, onClick }) => {
    if (!cell) {
        return null
    }
    const stringValue = takeFirst(customToString(cell.value), 50)
    const onCellClick = () => {
        onClick(cell.value)
    }
    return (
        <td onClick={onCellClick} role="gridcell" className={`text-center text-nowrap data-test-id-cell-data`}>
            <button className="btn">{stringValue}</button>
        </td>
    )
}
