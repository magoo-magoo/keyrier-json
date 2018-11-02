import * as React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../../Deferred/DeferredReactstrap';
import './OutputTable.css';
import { connect } from 'react-redux';
import OutputTableView from './OutputTableView';
import {
  toggleOutputTableModal,
  ToggleOutputTableModal,
} from '../../../Actions/actions';
import {
  getisOutputTableModalOpen,
  getOutputTableData,
} from '../../../Store/selectors';
import { AppState } from '../../../State/State';

interface Props {
  toggleModal: () => ToggleOutputTableModal;
  isModalOpen: boolean;
}

export const OutputTable: React.SFC<Props> = ({ toggleModal, isModalOpen }) => {
  return (
    <div className="output-table">
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Table view</ModalHeader>
        <ModalBody>
          <OutputTableView />
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <div className="row">
        <div className="col">
          <Button
            block={true}
            color="dark"
            outline={true}
            onClick={toggleModal}
          >
            Display results table fullscreen
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <OutputTableView />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: Readonly<AppState>) => ({
  data: getOutputTableData(state),
  isModalOpen: getisOutputTableModalOpen(state),
});

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleOutputTableModal,
  }
)(OutputTable);
