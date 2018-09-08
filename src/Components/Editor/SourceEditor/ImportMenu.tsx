import * as React from "react";
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
  Input
} from "../../Deferred/DeferredReactstrap";
import { UpdateSource, updateSource } from "../../../Actions/actions";
import { AppState } from "../../../State/State";
import HttpRequestSource from "./RequestSource";
import './ImportMenu.css';
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
    return <React.Fragment>
        <ButtonDropdown isOpen={this.state.toggleDropdownIsOpen} toggle={this.toggleImportDropdown}>
          <DropdownToggle caret={true} color="primary">
            Import
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>
              <Label>
                Browse JSON file...
                <Input type="file" name="file" id="sourceFile" style={{ display: "none" }} onChange={this.onFileChange} />
              </Label>
            </DropdownItem>
            <DropdownItem onClick={this.toggleModal}>
              <Label>HTTP request</Label>
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <Modal id="requestModal" role="dialog" size="lg" isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>
            Import JSON from an HTTP request
          </ModalHeader>
          <ModalBody>
            <HttpRequestSource onRequestSucceed={this.toggleModal} />
          </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.toggleModal}>
            Cancel
            </Button>
        </ModalFooter>
        </Modal>
      </React.Fragment>;
  }

  private readonly toggleImportDropdown = () =>
    this.setState({
      toggleDropdownIsOpen: !this.state.toggleDropdownIsOpen
    });

  private toggleModal = () => this.setState({ modal: !this.state.modal });

  private onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          this.props.onFileContentReady(fileReader.result.toString());
        }
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };
}

const mapStateToProps = (state: Readonly<AppState>) => ({
  sourceText: state.rootReducer.source.text
});

export default connect(
  mapStateToProps,
  { onFileContentReady: updateSource }
)(ImportMenu);
