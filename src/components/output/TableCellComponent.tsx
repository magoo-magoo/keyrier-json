import * as React from 'react'
import { FC } from 'react'
import { customToString, takeFirst } from 'core/converters/string'
import { Cell } from 'react-table'
import { itemType } from 'state/State'

type CellProps = {
    cell: Cell<any, itemType>
    onClick: (value: itemType) => void
}

export const TableCellComponent: FC<CellProps> = ({ cell, onClick }) => {
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
