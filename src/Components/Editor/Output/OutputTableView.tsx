import * as React from "react";
import { Fragment } from "react";
import { Col, Row } from "../../Deferred/DeferredReactstrap";
import { customToString, containsIgnoreCase } from "../../../helpers/string";
import "./OutputTable.css";
import { connect } from "react-redux";
import TableAdvancedOptions from "./TableAdvancedOptions";

import { LoadableReactTable } from "../../Deferred/DeferredReactTable";
import { Column, Filter } from "react-table";
import { itemType, AppState } from "../../../State/State";

interface Props {
  data: itemType[];
  displayedColumns: string[];
  groupBy: string[];
}

export const OutputTableView: React.SFC<Props> = ({
  data,
  displayedColumns,
  groupBy
}) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <div />;
  }

  const tableColumnConfig = displayedColumns.map<Column>(key => ({
    Aggregated: (row: any) => (row ? row.value : ""),
    Cell: (cellProps: any) =>
      cellProps ? customToString(cellProps.value) : "",
    Header: key,
    accessor: key,
    className: "text-center"
  }));

  const defaultFilterMethod = (filter: Filter, row: itemType) =>
    filter &&
    row &&
    containsIgnoreCase(customToString(row[filter.id]), filter.value);

  return (
    <Fragment>
      <Row>
        <Col>
          <TableAdvancedOptions />
        </Col>
      </Row>
      <Row>
        <Col>
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
        </Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state: Readonly<AppState>) => {
  return {
    data: state.rootReducer.output.table.array,
    displayedColumns: state.rootReducer.output.table.displayedColumns,
    columns: state.rootReducer.output.table.columns,
    groupBy: state.rootReducer.output.table.groupBy
  };
};

export default connect(mapStateToProps)(OutputTableView);
