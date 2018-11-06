import * as React from 'react';
import { customToString, containsIgnoreCase } from '../../../helpers/string';
import './OutputTable.css';
import { connect } from 'react-redux';
import TableAdvancedOptions from './TableAdvancedOptions';

import { LoadableReactTable } from '../../Deferred/DeferredReactTable';
import { Column, Filter } from 'react-table';
import { itemType, RootState } from '../../../State/State';
import {
  getOutputTableData,
  getdisplayedColumns,
  getColumns,
  getGroupBy,
} from '../../../Store/selectors';

interface Props {
  data: itemType[];
  displayedColumns: string[];
  groupBy: string[];
}

export const OutputTableView: React.SFC<Props> = ({
  data,
  displayedColumns,
  groupBy,
}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div />;
  }

  const tableColumnConfig = displayedColumns.map<Column>(key => ({
    Aggregated: (row: any) => (row ? row.value : ''),
    Cell: (cellProps: any) =>
      cellProps ? customToString(cellProps.value) : '',
    Header: key,
    accessor: key,
    className: 'text-center',
  }));

  const defaultFilterMethod = (filter: Filter, row: itemType) =>
    filter &&
    row &&
    containsIgnoreCase(customToString(row[filter.id]), filter.value);

  return (
    <>
      <div className="row">
        <div className="col">
          <TableAdvancedOptions />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <LoadableReactTable
            noDataText="Oh Noes!"
            className="-highlight"
            data={data.map(e => (e ? e : {}))}
            defaultPageSize={20}
            columns={tableColumnConfig}
            filterable={true}
            pivotBy={groupBy}
            defaultFilterMethod={defaultFilterMethod}
          />
        </div>
      </div>
      <div className="mx-3 align-items-center justify-content-end d-flex">
        <h4>Number of elements: {data.length}</h4>
      </div>
    </>
  );
};

const mapStateToProps = (state: Readonly<RootState>) => {
  return {
    data: getOutputTableData(state),
    displayedColumns: getdisplayedColumns(state),
    columns: getColumns(state),
    groupBy: getGroupBy(state),
  };
};

export default connect(mapStateToProps)(OutputTableView);
