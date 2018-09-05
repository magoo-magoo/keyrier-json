import * as React from "react";
import { Fragment } from "react";
import {
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../Deferred/DeferredReactstrap";
import "./OutputTable.css";
import { connect } from "react-redux";
import { AppState } from "src/State/State";
import OutputTableView from "./OutputTableView";
import {
  toggleOutputTableModal,
  ToggleOutputTableModal
} from "../../../Actions/actions";
import { getisOutputTableModalOpen, getOutputTableData } from "../../../Store/selectors";

interface Props {
  toggleModal: () => ToggleOutputTableModal;
  isModalOpen: boolean;
}

export const OutputTable: React.SFC<Props> = ({ toggleModal, isModalOpen }) => {
  return (
    <Fragment>
      <Modal
        isOpen={isModalOpen}
        toggle={toggleModal}
      >
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
      <div>
        <Row>
          <Col>
            <Button block={true} color="dark" outline={true} onClick={toggleModal}>
              Display results table fullscreen
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <OutputTableView />
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state: Readonly<AppState>) => ({
  data: getOutputTableData(state),
  isModalOpen: getisOutputTableModalOpen(state)
});

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleOutputTableModal
  }
)(OutputTable);
