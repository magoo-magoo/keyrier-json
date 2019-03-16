import * as React from 'react'
import './OutputTable.css'
import { connect } from 'react-redux'
import OutputTableView from './OutputTableView'
import { toggleOutputTableModal, ToggleOutputTableModal } from '../../../Actions/actions'
import { getisOutputTableModalOpen, getOutputObject } from '../../../Store/selectors'
import { RootState } from '../../../State/State'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { memo } from 'react'
import { withErrorBoundary } from '../../Common/ErrorBoundary'

interface Props {
  toggleModal: () => ToggleOutputTableModal
  isModalOpen: boolean
}

const OutputTable: React.FC<Props> = ({ toggleModal, isModalOpen }) => {
  return (
    <div className="output-table">
      <Modal isOpen={isModalOpen} toggle={toggleModal} className="mw-100">
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
          <Button block={true} color="dark" outline={true} onClick={toggleModal}>
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
  )
}

const mapStateToProps = (state: RootState) => ({
  data: getOutputObject(state),
  isModalOpen: getisOutputTableModalOpen(state),
})

export default connect(
  mapStateToProps,
  {
    toggleModal: toggleOutputTableModal,
  }
)(withErrorBoundary(memo(OutputTable)))
