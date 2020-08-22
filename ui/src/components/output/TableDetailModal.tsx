import Loading from 'components/common/Loading'
import * as React from 'react'
import { FC, Suspense } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { itemType } from 'state/State'

const ReactJson = React.lazy(() => import(/* webpackChunkName: "react-json-view" */ 'react-json-view'))

export type DetailModalProps = {
    value: itemType
    onClose: () => void
}

export const TableDetailModal: FC<DetailModalProps> = ({ value, onClose }) => (
    <Modal isOpen={!!value} toggle={onClose} size="lg">
        <ModalHeader>Details</ModalHeader>
        <ModalBody>
            {typeof value === 'object' ? (
                <Suspense fallback={<Loading componentName="ReactJson" />}>
                    <ReactJson
                        src={value ? value : {}}
                        name="data"
                        iconStyle="triangle"
                        indentWidth={8}
                        onAdd={() => null}
                        onDelete={() => null}
                        onEdit={() => null}
                        onSelect={() => null}
                    />
                </Suspense>
            ) : (
                value
            )}
        </ModalBody>
    </Modal>
)
