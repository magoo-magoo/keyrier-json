import * as React from 'react'
import { FC } from 'react'

export const DefaultColumnFilter: FC<any> = table => {
    return (
        <div>
            <input
                className="form-control form-control-sm"
                value={table.column.filterValue || ''}
                onChange={e => {
                    table.column.setFilter(e.target.value || undefined)
                }}
            />
        </div>
    )
}
