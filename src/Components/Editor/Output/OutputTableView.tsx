import React, { Fragment } from "react";
import ReactTable, { Column, Filter } from "react-table";
import { Col, Row } from "reactstrap";
import { customToString, containsIgnoreCase } from "../../../helpers/string";
import "./OutputTable.css";
import { connect } from "react-redux";
import { AppState } from "src/State/State";
import {
  UpdateTableColumns,
  UpdateTableGroupBy
} from "../../../Actions/actions";
import TableAdvancedOptions from "./TableAdvancedOptions";

interface Props {
  data: Array<{}>;
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
    Aggregated: (row: any) => row.value,
    Cell: (cellProps: any) => customToString(cellProps.value),
    Header: key,
    accessor: key,
    className: "text-center"
  }));

  const defaultFilterMethod = (filter: Filter, row: any) =>
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
          <ReactTable
            noDataText="Oh Noes!"
            className="-highlight"
            data={data}
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
