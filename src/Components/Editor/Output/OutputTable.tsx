import React, { Fragment } from "react";
import ReactTable, { Column, Filter } from "react-table";

import {
  Col,
  Input,
  Label,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { customToString, containsIgnoreCase } from "../../../helpers/string";
import "./OutputTable.css";

interface Props<T> {
  data: T[];
}
interface State {
  groupBy: string[];
  modal: boolean;
}

export class OutputTable<T> extends React.Component<Props<T>, State> {
  public constructor(props: Props<T>) {
    super(props);
    this.state = { groupBy: [], modal: false };
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
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .map<Column>(key => {
        return {
          Aggregated: (row: any) => row.value,
          Cell: (props: any) => customToString(props.value),
          Header: key,
          accessor: key
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
        columns={columns}
        filterable={true}
        pivotBy={this.state.groupBy}
        defaultFilterMethod={defaultFilterMethod}
      />
    );
    return (
      <Fragment>
        <Modal
          isOpen={this.state.modal}
          modalTransition={{ timeout: 700 }}
          backdropTransition={{ timeout: 1300 }}
          toggle={this.toggle}
        >
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>{table}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <div>
          <Row>
            <Col sm={2}>
              <Row>
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
              </Row>
              <Row>
                <Button color="danger" onClick={this.toggle}>
                  Expand
                </Button>
              </Row>
            </Col>
            <Col sm={10}>{table}</Col>
          </Row>
        </div>
      </Fragment>
    );
  }

  private readonly toggle = () =>
    this.setState({ ...this.state, modal: !this.state.modal });
  private readonly handleGroupingSelectChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      ...this.state,
      groupBy: e.target.value === "column..." ? [] : [e.target.value]
    });
  };
}

export default OutputTable;
