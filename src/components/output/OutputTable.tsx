import * as React from 'react'
import './OutputTable.scss'
import { connect } from 'react-redux'
import OutputTableView from './OutputTableView'
import { toggleOutputTableModal } from 'actions/actions'
import { getisOutputTableModalOpen, getOutputObject } from 'store/selectors'
import { RootState } from 'state/State'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import { memo, FC } from 'react'
import { withErrorBoundary } from 'components/common/ErrorBoundary'

interface Props {
    toggleModal: typeof toggleOutputTableModal
    isModalOpen: boolean
}

const OutputTable: FC<Props> = ({ toggleModal, isModalOpen }) => {
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
