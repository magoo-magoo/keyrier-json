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
  ModalHeader,
} from "reactstrap";
import { UpdateSource, updateSource } from "../../../Actions/actions";
import { AppState } from "../../../State/State";

interface Props {
  onFileContentReady: (fileContent: string) => UpdateSource;
}

interface State {
  toggleDropdownIsOpen: boolean;
  modal: boolean;
}

export class ImportMenu extends Component<Props, State> {
  constructor(props: Props) {
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
                id="sourceFile"
                style={{ display: "none" }}
                onChange={this.onFileChange}
              />
            </Label>
            <DropdownItem onClick={this.toggleModal}>HTTP request</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Modal title</ModalHeader>
          <ModalBody>HTTP Request GUI</ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleModal}>
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
      toggleDropdownIsOpen: !this.state.toggleDropdownIsOpen,
    });
  private toggleModal = () =>
    this.setState({
      ...this.state,
      modal: !this.state.modal,
    });

  private onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          this.props.onFileContentReady(fileReader.result.toString());
        }
        this.props.onFileContentReady('');
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };
}

const mapStateToProps = (state: Readonly<AppState>) => ({
  sourceText: state.rootReducer.source.text,
});

export default connect(
  mapStateToProps,
  { onFileContentReady: updateSource },
)(ImportMenu);
