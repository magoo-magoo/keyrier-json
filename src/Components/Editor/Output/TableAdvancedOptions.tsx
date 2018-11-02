import * as React from "react";
import { Collapse, Button } from "../../Deferred/DeferredReactstrap";
import "./OutputTable.css";
import { connect } from "react-redux";
import {
  updateTableColumns,
  UpdateTableColumns,
  UpdateTableGroupBy,
  updateTableGroupBy,
} from "../../../Actions/actions";
import { LoadableReactSelect } from "../../Deferred/DeferredReactSelect";
import { itemType, AppState } from "../../../State/State";
import { ActionMeta, ValueType } from "react-select/lib/types";

interface Props {
  data: itemType[];
  displayedColumns: string[];
  groupBy: string[];
  columns: string[];
  onColumnsChange: (v: string[]) => UpdateTableColumns;
  updateTableGroupBy: (v: string[]) => UpdateTableGroupBy;
}
interface State {
  optionsCollapsed: boolean;
}

export class TableAdvancedOptions extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = { optionsCollapsed: false };
  }

  public render() {
    if (this.props.columns.length <= 0) {
      return <div />;
    }

    const columnOptions = this.props.columns.map(k => ({ value: k, label: k }));

    return (
      <div className="row">
        <div className="col">
          <Button
            className={"float-left"}
            color="primary"
            block={true}
            onClick={this.toggleCollapseOptions}
          >
            {this.state.optionsCollapsed
              ? "Hide advanced options"
              : "Advanced options"}
          </Button>
          <Collapse isOpen={this.state.optionsCollapsed}>
            <select
              className="form-control-lg form-control"
              name="select"
              id="groupingSelect"
              onChange={this.handleGroupingSelectChange}
            >
              <option key={"Group by..."}>Group by...</option>
              {this.props.displayedColumns.map(key => (
                <option key={key}>{key}</option>
              ))}
            </select>
            <Button
              color={"success"}
              onClick={this.handleOnclickOnExportToExcel}
            >
              Export to Excel (.xlsx)
            </Button>
            <LoadableReactSelect
              options={columnOptions}
              value={this.props.displayedColumns.map(k => ({
                value: k,
                label: k,
              }))}
              isMulti={true}
              onChange={this.handleColumnChange}
            />
          </Collapse>
        </div>
      </div>
    );
  }

  private readonly handleColumnChange = (
    cols: ValueType<{}> | undefined | null,
    _action: ActionMeta
  ) => {
    if (cols instanceof Array) {
      const mapped = cols.map(
        (c: { value?: string }) => (c.value ? c.value : "")
      );
      this.props.onColumnsChange(mapped);
    }
  };

  private readonly handleGroupingSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.props.updateTableGroupBy([e.target.value]);
  };

  private readonly toggleCollapseOptions = () =>
    this.setState({
      ...this.state,
      optionsCollapsed: !this.state.optionsCollapsed,
    });

  private readonly handleOnclickOnExportToExcel = async () => {
    const xlsx = await import(/* webpackChunkName: "xlsx.js" */ "xlsx");
    const workBook = xlsx.utils.book_new();
    const workSheet = xlsx.utils.json_to_sheet(this.props.data);
    xlsx.utils.book_append_sheet(workBook, workSheet, "keyrier-json");
    xlsx.writeFile(workBook, "export.xlsx");
  };
}

const mapStateToProps = (state: Readonly<AppState>) => {
  return {
    data: state.rootReducer.output.table.array,
    displayedColumns: state.rootReducer.output.table.displayedColumns,
    columns: state.rootReducer.output.table.columns,
    groupBy: state.rootReducer.output.table.groupBy,
  };
};

export default connect(
  mapStateToProps,
  { onColumnsChange: updateTableColumns, updateTableGroupBy }
)(TableAdvancedOptions);
