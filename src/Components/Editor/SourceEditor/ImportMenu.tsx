import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import {
  UpdateSource,
  updateSource,
  ResetEditor,
  resetEditor,
} from '../../../Actions/actions';
import HttpRequestSource from './RequestSource';
import './ImportMenu.css';
import { logInfo } from '../../../helpers/logger';
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';
interface Props {
  onFileContentReady: (fileContent: string) => UpdateSource;
  onReset: () => ResetEditor;
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
      <>
        <ButtonDropdown
          isOpen={this.state.toggleDropdownIsOpen}
          toggle={this.toggleImportDropdown}
        >
          <DropdownToggle caret={true} color="primary">
            Import
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem toggle={false}>
              <label>
                Browse JSON file...
                <input
                  type="file"
                  name="file"
                  id="sourceFile"
                  style={{ display: 'none' }}
                  onChange={this.onFileChange}
                />
              </label>
            </DropdownItem>
            <DropdownItem onClick={this.toggleModal}>
              <label>HTTP request</label>
            </DropdownItem>
            <DropdownItem onClick={this.props.onReset}>
              <label>Reset</label>
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <Modal
          id="requestModal"
          role="dialog"
          size="lg"
          isOpen={this.state.modal}
          toggle={this.toggleModal}
        >
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
      </>
    );
  }

  private readonly toggleImportDropdown = () =>
    this.setState({
      toggleDropdownIsOpen: !this.state.toggleDropdownIsOpen,
    });

  private toggleModal = () => this.setState({ modal: !this.state.modal });

  private onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    logInfo('onFileChange');
    this.toggleImportDropdown();
    if (e.target.files && e.target.files.length > 0) {
      const fileReader = new FileReader();
      logInfo('e.target.files', e.target.files[0].name);
      fileReader.onload = () => {
        if (fileReader.result) {
          this.props.onFileContentReady(fileReader.result.toString());
        }
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };
}

const mapStateToProps = () => ({});

export default connect(
  mapStateToProps,
  { onFileContentReady: updateSource, onReset: resetEditor }
)(ImportMenu);
