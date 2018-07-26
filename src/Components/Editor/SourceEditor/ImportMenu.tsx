import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import { IUpdateSource, updateSource } from "../../../Actions/Actions";
import { IAppState } from "../../../State/State";

interface IProps {
  onFileContentReady: (fileContent: string) => IUpdateSource;
}

interface IState {
  toggleDropdownIsOpen: boolean;
  modal: boolean;
}

export class ImportMenu extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { toggleDropdownIsOpen: false, modal: false };
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
            <DropdownItem onClick={this.openModal}>HTTP request</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <Modal isOpen={this.state.modal} toggle={this.openModal}>
          <ModalHeader toggle={this.openModal}>Modal title</ModalHeader>
          <ModalBody>HTTP Request GUI</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.openModal}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={this.openModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  private toggleImportDropdown = () =>
    this.setState({
      ...this.state,
      toggleDropdownIsOpen: !this.state.toggleDropdownIsOpen
    });
  private openModal = () =>
    this.setState({
      ...this.state,
      modal: !this.state.modal
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

const mapStateToProps = (state: Readonly<IAppState>) => ({
  sourceText: state.rootReducer.source.text
});

export default connect(
  mapStateToProps,
  { onFileContentReady: updateSource }
)(ImportMenu);
