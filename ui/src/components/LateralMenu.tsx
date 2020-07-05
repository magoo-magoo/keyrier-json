import Actions from 'actions/actions'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { logDebug } from 'core/logging/logger'
import { withPerformance } from 'core/logging/performance'
import { useToggleState } from 'hooks/hooks'
import * as React from 'react'
import { ChangeEvent, FC, memo, useCallback } from 'react'
import { connect } from 'react-redux'
import {
    Button,
    ButtonDropdown,
    ButtonGroup,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from 'reactstrap'
import { ActionCreators } from 'redux-undo'
import { QueryMode, RootState } from 'state/State'
import { getCanRedo, getCanUndo, getQueryMode, getSourceAutoFormat } from 'store/selectors'
import HttpRequestSource from './source/RequestSource'

interface Props {
    onFileContentReady: typeof Actions.updateSource
    changeAutoFormat: typeof Actions.updateAutoFormatSource
    onReset: typeof Actions.resetEditor
    onClear: typeof Actions.clearEditor
    setQueryMode: typeof Actions.updateQueryMode
    mode: QueryMode
    onUndo: typeof Actions.undo
    onRedo: typeof Actions.redo
    canRedo: boolean
    canUndo: boolean
    autoFormat: boolean
    resetHistory: typeof ActionCreators.clearHistory
}

const LateralMenu: FC<Props> = ({
    onReset,
    onFileContentReady,
    onClear,
    autoFormat,
    changeAutoFormat,
    onRedo,
    onUndo,
    canRedo,
    canUndo,
    setQueryMode,
    mode,
    resetHistory,
}) => {
    const [dropdownIsOpen, toggleDropdown] = useToggleState()
    const [modalIsOpen, toggleModal] = useToggleState()
    const handleFileChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            logDebug('onFileChange')
            toggleDropdown()
            if (e.target.files && e.target?.files?.length > 0) {
                const fileReader = new FileReader()
                logDebug('e.target.files', e.target.files[0].name)
                fileReader.onload = () => {
                    if (fileReader.result) {
                        onFileContentReady(fileReader.result.toString())
                    }
                }
                fileReader.readAsText(e.target.files[0])
            }
        },
        [toggleDropdown, onFileContentReady]
    )

    const handleAutoFormatChange = useCallback(() => changeAutoFormat(!autoFormat), [changeAutoFormat, autoFormat])

    return (
        <>
            <ButtonGroup className="d-flex" vertical={true}>
                <ButtonGroup vertical={false}>
                    <Button
                        className="d-flex justify-content-center align-content-between"
                        color="secondary"
                        size={'sm'}
                        onClick={onUndo}
                        disabled={!canUndo}
                    >
                        <i className="material-icons mr-1 md-18">undo</i>
                        <span>Undo</span>
                    </Button>
                    <Button
                        className="d-flex justify-content-center align-content-between"
                        color="secondary"
                        size={'sm'}
                        onClick={onRedo}
                        disabled={!canRedo}
                    >
                        Redo
                        <i className="material-icons mr-1 md-18">redo</i>
                    </Button>
                </ButtonGroup>
                <br />
                <br />
                <Label
                    className="d-flex justify-content-center align-content-between"
                    check={true}
                    onClick={handleAutoFormatChange}
                >
                    <i className="material-icons mr-1">{autoFormat ? 'check_box' : 'check_box_outline_blank'}</i>
                    Auto format
                </Label>
                <br />
                <ButtonDropdown isOpen={dropdownIsOpen} toggle={toggleDropdown}>
                    <DropdownToggle
                        className="d-flex justify-content-center align-content-between"
                        size={'lg'}
                        id="import-menu-button"
                        color="primary"
                    >
                        <i className="material-icons mr-1 md-18">unarchive</i>
                        Import
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem toggle={false}>
                            <label id="import-file">
                                Browse JSON file...
                                <input
                                    type="file"
                                    name="file"
                                    id="sourceFile"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                            </label>
                        </DropdownItem>
                        <DropdownItem id="http-request" onClick={toggleModal}>
                            <label>HTTP request</label>
                        </DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>
                <br />
                <br />
                <Button
                    className="d-flex justify-content-center align-content-between"
                    color="secondary"
                    size={'lg'}
                    onClick={() => {
                        onReset()
                        resetHistory()
                    }}
                >
                    <div>
                        <i className="material-icons md-18 mr-1">autorenew</i>
                    </div>
                    <div>Reset</div>
                </Button>
                <br />

                {mode === 'Javascript' ? (
                    <Button
                        className="d-flex justify-content-center align-content-between"
                        color="secondary"
                        size={'lg'}
                        onClick={() => setQueryMode('SQL')}
                    >
                        <div>
                            <i className="material-icons md-18  mr-1">settings</i>
                        </div>
                        <div>Switch to SQL-like</div>
                    </Button>
                ) : (
                    <Button
                        className="d-flex justify-content-center align-content-between"
                        color="secondary"
                        size={'lg'}
                        onClick={() => setQueryMode('Javascript')}
                    >
                        <div>
                            <i className="material-icons md-18  mr-1">settings</i>
                        </div>
                        <div>Switch to JS</div>
                    </Button>
                )}

                <br />
                <Button
                    className="d-flex justify-content-center align-content-between"
                    color="danger"
                    size={'lg'}
                    onClick={onClear}
                >
                    <div>
                        <i className="material-icons md-18  mr-1">clear</i>
                    </div>
                    <div>Clear</div>
                </Button>
            </ButtonGroup>
            <Modal id="requestModal" role="dialog" size="lg" isOpen={modalIsOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Import JSON from an HTTP request</ModalHeader>
                <ModalBody>
                    <HttpRequestSource onFinish={toggleModal} />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    autoFormat: getSourceAutoFormat(state),
    canUndo: getCanUndo(state),
    canRedo: getCanRedo(state),
    mode: getQueryMode(state),
})

export default connect(mapStateToProps, {
    onFileContentReady: Actions.updateSource,
    onReset: Actions.resetEditor,
    onClear: Actions.clearEditor,
    onUndo: Actions.undo,
    onRedo: Actions.redo,
    resetHistory: ActionCreators.clearHistory,
    changeAutoFormat: Actions.updateAutoFormatSource,
    setQueryMode: Actions.updateQueryMode,
})(memo(withErrorBoundary(withPerformance(LateralMenu, 'LateralMenu'))))
