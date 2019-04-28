import * as React from 'react'
import { connect } from 'react-redux'
import {
  updateSource,
  resetEditor,
  clearEditor,
  updateAutoFormatSource,
  undo,
  redo,
  updateQueryMode,
} from 'actions/actions'
import HttpRequestSource from './source/RequestSource'
import { logInfo } from 'core/logging/logger'
import { useToggleState } from 'hooks/hooks'
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
  ButtonGroup,
  Label,
} from 'reactstrap'
import { memo, useCallback, FC, ChangeEvent } from 'react'
import { withErrorBoundary } from 'components/common/ErrorBoundary'
import { getSourceAutoFormat, getCanUndo, getCanRedo, getQueryMode } from 'store/selectors'
import { RootState, QueryMode } from 'state/State'

interface Props {
  onFileContentReady: typeof updateSource
  changeAutoFormat: typeof updateAutoFormatSource
  onReset: typeof resetEditor
  onClear: typeof clearEditor
  setQueryMode: typeof updateQueryMode
  mode: QueryMode
  onUndo: typeof undo
  onRedo: typeof redo
  canRedo: boolean
  canUndo: boolean
  autoFormat: boolean
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
}) => {
  const [dropdownIsOpen, toggleDropdown] = useToggleState()
  const [modalIsOpen, toggleModal] = useToggleState()
  const [modeOpen, switchModeOpen] = useToggleState()
  const setJsMode = useCallback(() => setQueryMode('Javascript'), [setQueryMode])
  const setSqlMode = useCallback(() => setQueryMode('SQL'), [setQueryMode])
  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      logInfo('onFileChange')
      toggleDropdown()
      if (e.target.files && e.target.files.length > 0) {
        const fileReader = new FileReader()
        logInfo('e.target.files', e.target.files[0].name)
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
      <ButtonGroup className="mt-5" vertical={true}>
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
          onClick={onReset}
        >
          <div>
            <i className="material-icons md-18 mr-1">autorenew</i>
          </div>
          <div>Reset</div>
        </Button>
        <br />

        <ButtonDropdown isOpen={modeOpen} toggle={switchModeOpen}>
          <DropdownToggle className="d-flex justify-content-center align-content-between" size={'lg'} color="secondary">
            <div>
              <i className="material-icons md-18 mr-1">settings</i>
            </div>
            <div>Mode</div>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header={true}>Choose query mode</DropdownItem>
            <DropdownItem active={mode === 'Javascript'} onClick={setJsMode}>
              Javascript
            </DropdownItem>
            <DropdownItem active={mode === 'SQL'} onClick={setSqlMode}>
              SQL like (experimental)
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
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

export default connect(
  mapStateToProps,
  {
    onFileContentReady: updateSource,
    onReset: resetEditor,
    onClear: clearEditor,
    onUndo: undo,
    onRedo: redo,
    changeAutoFormat: updateAutoFormatSource,
    setQueryMode: updateQueryMode,
  }
)(memo(withErrorBoundary(LateralMenu)))
