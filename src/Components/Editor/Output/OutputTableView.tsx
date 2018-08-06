import React from "react";
import ReactTable, { Column, Filter } from "react-table";
import { Col, Input, Row, Collapse, Button } from "reactstrap";
import { customToString, containsIgnoreCase } from "../../../helpers/string";
import "./OutputTable.css";
import { connect } from "react-redux";
import { AppState } from "src/State/State";
import Select from "react-select";
import {
  updateTableColumns,
  UpdateTableColumns
} from "../../../Actions/actions";
import * as XLSX from "xlsx";

interface Props {
  data: Array<{}>;
  displayedColumns: string[];
  columns: string[];
  onColumnsChange: (v: string[]) => UpdateTableColumns;
}
interface State {
  groupBy: string[];
  optionsCollapsed: boolean;
}

export class OutputTableView extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { groupBy: [], optionsCollapsed: false };
  }

  public render() {
    if (
      !this.props.data ||
      !Array.isArray(this.props.data) ||
      this.props.data.length === 0
    ) {
      return <div />;
    }

    if (this.props.columns.length <= 0) {
      return <div />;
    }

    const tableColumnConfig = this.props.displayedColumns.map<Column>(key => {
      return {
        Aggregated: (row: any) => row.value,
        Cell: (props: any) => customToString(props.value),
        Header: key,
        accessor: key,
        className: "text-center"
      };
    });

    const defaultFilterMethod = (filter: Filter, row: any) =>
      containsIgnoreCase(customToString(row[filter.id]), filter.value);

    const table = (
      <ReactTable
        noDataText="Oh Noes!"
        className="-highlight"
        data={this.props.data}
        defaultPageSize={20}
        columns={tableColumnConfig}
        filterable={true}
        pivotBy={this.state.groupBy}
        defaultFilterMethod={defaultFilterMethod}
      />
    );

    const columnOptions = this.props.columns.map(k => ({ value: k, label: k }));

    return (
      <Row>
        <Col>
          <Button
            className={"float-left"}
            color="primary"
            onClick={this.toggleCollapseOptions}
          >
            {this.state.optionsCollapsed
              ? "Hide advanced options"
              : "Advanced options"}
          </Button>
          <Collapse isOpen={this.state.optionsCollapsed}>
            <Input
              type="select"
              name="select"
              id="groupingSelect"
              onChange={this.handleGroupingSelectChange}
            >
              <option key={"Group by..."}>Group by...</option>
              {this.props.displayedColumns.map(key => (
                <option key={key}>{key}</option>
              ))}
            </Input>
            <Button
              color={"success"}
              onClick={this.handleOnclickOnExportToExcel}
            >
              Export to Excel (.xlsx)
            </Button>
            <Select
              options={columnOptions}
              value={this.props.displayedColumns.map(k => ({
                value: k,
                label: k
              }))}
              isMulti={true}
              onChange={this.handleColumnChange}
            />
          </Collapse>
          {table}
        </Col>
      </Row>
    );
  }

  private readonly handleColumnChange = (a: Array<{ value: string }>) => {
    const newValues = a.map(c => c.value);
    if (this.state.groupBy.length !== 0) {
      this.state.groupBy.forEach(groupBy => {
        if (a.map(t => t.value).indexOf(groupBy) === -1) {
          this.setState({
            ...this.state,
            groupBy: this.state.groupBy.filter(gb => gb !== groupBy)
          });
        }
      });
    }
    this.props.onColumnsChange(newValues);
  };

  private readonly handleGroupingSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      ...this.state,
      groupBy: this.setGroupBy(e.target.value)
    });
  };

  private readonly toggleCollapseOptions = () =>
    this.setState({
      ...this.state,
      optionsCollapsed: !this.state.optionsCollapsed
    });

  private readonly setGroupBy = (groupBy: string) => {
    return groupBy === "Group by..." &&
      this.props.displayedColumns.indexOf(groupBy) !== -1
      ? []
      : [groupBy];
  };

  private readonly handleOnclickOnExportToExcel = () => {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(this.props.data);
    XLSX.utils.book_append_sheet(workBook, workSheet, "keyrier-json");

    XLSX.writeFile(workBook, "export.xlsx");
  };
}

const mapStateToProps = (state: Readonly<AppState>) => {
  return {
    data: state.rootReducer.output.table.array,
    displayedColumns: state.rootReducer.output.table.displayedColumns,
    columns: state.rootReducer.output.table.columns
  };
};

export default connect(
  mapStateToProps,
  { onColumnsChange: updateTableColumns }
)(OutputTableView);
