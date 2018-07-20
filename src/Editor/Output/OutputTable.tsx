import React from "react";
import ReactTable from "react-table";

interface IProps {
  data: any[];
}

class OutputTable extends React.Component<IProps> {
  public render() {
    if (!this.props.data || !Array.isArray(this.props.data)) {
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
        Cell: (props: any) => {
          if (Array.isArray(props.value)) {
            return JSON.stringify(props.value);
          }
          return <span>{props.value.toString()}</span>;
        },
        Header: key,
        accessor: key
      };
    });
    return (
      <ReactTable
        data={this.props.data}
        defaultPageSize={5}
        columns={columns}
        filterable={true}
      />
    );
  }
}

export default OutputTable;
