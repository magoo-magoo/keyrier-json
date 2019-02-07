import * as React from 'react'
import './OutputTable.css'
import { connect } from 'react-redux'
import {
  updateTableColumns,
  UpdateTableColumns,
  UpdateTableGroupBy,
  updateTableGroupBy,
} from '../../../Actions/actions'
import { LoadableReactSelect } from '../../Deferred/DeferredReactSelect'
import { itemType, RootState } from '../../../State/State'
import { ValueType } from 'react-select/lib/types'
import { getTableArray, getdisplayedColumns, getColumns, getGroupBy } from '../../../Store/selectors'
import { useToggleState } from '../../../Hooks/hooks'
import { Button, Collapse } from '../../Deferred/DeferredReactstrap'

interface Props {
  data: itemType[]
  displayedColumns: string[]
  groupBy: string[]
  columns: string[]
  onColumnsChange: (v: string[]) => UpdateTableColumns
  setTableGroupBy: (v: string[]) => UpdateTableGroupBy
}

const handleOnclickOnExportToExcel = async (data: any) => {
  const xlsx = await import(/* webpackChunkName: "xlsx.js" */ 'xlsx')
  const workBook = xlsx.utils.book_new()
  const workSheet = xlsx.utils.json_to_sheet(data)
  xlsx.utils.book_append_sheet(workBook, workSheet, 'keyrier-json')
  xlsx.writeFile(workBook, 'export.xlsx')
}

export const TableAdvancedOptions: React.FC<Props> = ({
  onColumnsChange,
  columns,
  setTableGroupBy,
  data,
  displayedColumns,
}) => {
  const [optionsCollapsed, switchOptionsCollapsed] = useToggleState()

  const handleColumnChange = (cols: ValueType<{}> | undefined | null) => {
    if (cols instanceof Array) {
      const mapped = cols.map((c: { value?: string }) => (c.value ? c.value : ''))
      onColumnsChange(mapped)
    }
  }

  if (columns.length <= 0) {
    return <></>
  }

  const columnOptions = columns.map(k => ({ value: k, label: k }))

  return (
    <div className="row">
      <div className="col">
        <Button className={'float-left'} color="primary" block={true} onClick={switchOptionsCollapsed}>
          {optionsCollapsed ? 'Hide advanced options' : 'Advanced options'}
        </Button>
        <Collapse isOpen={optionsCollapsed}>
          <select
            className="form-control-lg form-control"
            name="select"
            id="groupingSelect"
            onChange={e => setTableGroupBy([e.target.value])}
          >
            <option key={'Group by...'}>Group by...</option>
            {displayedColumns.map(key => (
              <option key={key}>{key}</option>
            ))}
          </select>
          <Button color={'success'} onClick={() => handleOnclickOnExportToExcel(data)}>
            Export to Excel (.xlsx)
          </Button>
          <LoadableReactSelect
            options={columnOptions}
            value={displayedColumns.map(k => ({
              value: k,
              label: k,
            }))}
            isMulti={true}
            onChange={handleColumnChange}
          />
        </Collapse>
      </div>
    </div>
  )
}

const mapStateToProps = (state: Readonly<RootState>) => {
  return {
    data: getTableArray(state),
    displayedColumns: getdisplayedColumns(state),
    columns: getColumns(state),
    groupBy: getGroupBy(state),
  }
}

export default connect(
  mapStateToProps,
  { onColumnsChange: updateTableColumns, setTableGroupBy: updateTableGroupBy }
)(TableAdvancedOptions)
