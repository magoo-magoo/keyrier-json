import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label
} from "reactstrap";
import { ActionValue, updateSourceFile } from "../../../Actions/Actions";
import { IAppState } from "../../../State/State";

interface IProps {
  onFileContentReady: (fileContent: string) => ActionValue<string>;
}

interface IState {
  toggleDropdownIsOpen: boolean;
}

export class ImportMenu extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { toggleDropdownIsOpen: false };
  }

  public render() {
    return (
      <div>
        <ButtonDropdown
          isOpen={this.state.toggleDropdownIsOpen}
          toggle={this.toggleImportDropdown}
        >
          <DropdownToggle caret={true} color="primary">
            Import
          </DropdownToggle>
          <DropdownMenu>
            <Label>
              Browse JSON file...
              <input
                type="file"
                name="file"
                id="exampleFile"
                style={{ display: "none" }}
                onChange={this.onFileChange}
              />
            </Label>
            <DropdownItem disabled={true}>HTTP request</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }

  private toggleImportDropdown = () =>
    this.setState({
      ...this.state,
      toggleDropdownIsOpen: !this.state.toggleDropdownIsOpen
    });

  private onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.props.onFileContentReady(fileReader.result);
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };
}

const mapStateToProps = (state: IAppState) => ({
  sourceText: state.rootReducer.source.text
});

export default connect(
  mapStateToProps,
  { onFileContentReady: updateSourceFile }
)(ImportMenu);
