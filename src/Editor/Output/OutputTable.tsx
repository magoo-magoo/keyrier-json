import React from "react";
import ReactTable from "react-table";
import { customToString } from "../../helpers/string";

interface IProps<T> {
  data: T[];
}

class OutputTable<T> extends React.Component<IProps<T>> {
  public render() {
    if (
      !this.props.data ||
      !Array.isArray(this.props.data) ||
      this.props.data.length === 0
    ) {
      return <div />;
    }
    const keyMap = new Map<any, any>();

    this.props.data
      .filter(d => d && !Object.is(d, {}))
      .map(d => Object.keys(d))
      .forEach(keysToAdd => {
        keysToAdd.forEach(key => (keyMap[key] = key));
      });
    const keys = Object.keys(keyMap);

    if (keys.length <= 0) {
      return <div />;
    }

    const columns = keys.filter(key => typeof key === "string").map(key => {
      return {
        Aggregated: (row: any) => row.value,
        Cell: (props: any) => customToString(props.value),
        Header: key,
        accessor: key,
      };
    });
    return (
      <ReactTable className="highlight"
        data={this.props.data}
        defaultPageSize={10}
        columns={columns}
        filterable={true}
        pivotBy={[]}
      />
    );
  }
}

export default OutputTable;
