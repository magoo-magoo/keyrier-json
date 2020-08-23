import './OutputTable.scss'

import Actions from 'actions/actions'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { withPerformance } from 'core/logging/performance'
import * as React from 'react'
import { FC, memo } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { RootState } from 'state/State'
import { getisOutputTableModalOpen, getOutputObject } from 'store/selectors'

import View from './OutputTableView'

interface Props {
    toggleModal: typeof Actions.toggleOutputTableModal
    isModalOpen: boolean
}

const OutputTable: FC<Props> = ({ toggleModal, isModalOpen }) => {
    return (
        <div className="output-table d-flex h-100">
            <Modal isOpen={isModalOpen} toggle={toggleModal} className="mw-100">
                <ModalHeader toggle={toggleModal}>Table view</ModalHeader>
                <ModalBody>
                    <View />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            <View />
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    data: getOutputObject(state),
    isModalOpen: getisOutputTableModalOpen(state),
})

export default connect(mapStateToProps, {
    toggleModal: Actions.toggleOutputTableModal,
})(withErrorBoundary(memo(withPerformance(OutputTable, 'OutputTable'))))
