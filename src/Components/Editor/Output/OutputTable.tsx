import React from "react";
import ReactTable from "react-table";
import { Col, Input, Label, Row } from "reactstrap";
import { customToString } from "../../../helpers/string";

interface Props<T> {
  data: T[];
}
interface State {
  groupBy: string[];
}

export class OutputTable<T> extends React.Component<Props<T>, State> {
  public constructor(props: Props<T>) {
    super(props);
    this.state = { groupBy: [] };
  }

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
      .filter(d => d)
      .filter(d => typeof d === "object")
      .filter(d => !Object.is(d, {}))
      .filter(d => !Array.isArray(d))
      .map(d => Object.keys(d))
      .forEach(keysToAdd => {
        keysToAdd.forEach(key => (keyMap[key] = key));
      });
    const keys = Object.keys(keyMap);
    if (keys.length <= 0) {
      return <div />;
    }

    const columns = keys
      .filter(key => key)
      .filter(key => typeof key === "string")
      .filter(key => key.trim() !== "")
      .sort((a, b)=> a.toLowerCase().localeCompare(b.toLowerCase()))
      .map(key => {
        return {
          Aggregated: (row: any) => row.value,
          Cell: (props: any) => customToString(props.value),
          Header: key,
          accessor: key,
        };
      });

    return (
      <div>
        <Row>
          <Col sm={2}>
            <Label for="exampleSelect">Group by:</Label>
            <Input
              type="select"
              name="select"
              id="groupingSelect"
              onChange={this.handleGroupingSelectChange}
            >
              <option key={"column..."}>column...</option>
              {keys.map(key => <option key={key}>{key}</option>)}
            </Input>
          </Col>
          <Col sm={10}>
            <ReactTable
              noDataText="Oh Noes!"
              className="-highlight"
              data={this.props.data}
              defaultPageSize={10}
              columns={columns}
              filterable={true}
              pivotBy={this.state.groupBy}
            />
          </Col>
        </Row>
      </div>
    );
  }

  private readonly handleGroupingSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.setState({
      groupBy: e.target.value === "column..." ? [] : [e.target.value],
    });
  };
}

export default OutputTable;
