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

    this.props.data.map(d => Object.keys(d)).forEach(keys => {
      keys.forEach(key => (keyMap[key] = key));
    });

    const columns = Object.keys(keyMap)
      .filter(key => typeof key === "string")
      .map(key => {
        return {
          Cell: (props: any) => {
            if (
              typeof props.value === "string" ||
              typeof props.value === "number" ||
              typeof props.value === "boolean"
            ) {
              return <span>{props.value.toString()}</span>;
            }
            if (Array.isArray(props.value)) {
              return "cannot display array";
            }
            return "*";
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
