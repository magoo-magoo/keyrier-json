import * as React from 'react'
import { connect } from 'react-redux'
import {
  UpdateSource,
  updateSource,
  ResetEditor,
  resetEditor,
  ClearEditor,
  clearEditor,
} from '../../../Actions/actions'
import HttpRequestSource from './RequestSource'
import './ImportMenu.css'
import { logInfo } from '../../../helpers/logger'
import { useToggleState } from '../../../Hooks/hooks'
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
} from '../../Deferred/DeferredReactstrap'
import { memo } from 'react'
import { withErrorBoundary } from '../../Common/ErrorBoundary'
interface Props {
  onFileContentReady: (fileContent: string) => UpdateSource
  onReset: () => ResetEditor
  onClear: () => ClearEditor
}

const LateralMenu: React.FC<Props> = ({ onReset, onFileContentReady, onClear }) => {
  const [dropdownIsOpen, toggleDropdown] = useToggleState()
  const [modalIsOpen, toggleModal] = useToggleState()
  return (
    <>
      <ButtonGroup vertical={true}>
        <ButtonDropdown isOpen={dropdownIsOpen} toggle={toggleDropdown}>
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
                  onChange={onFileChange(toggleDropdown, onFileContentReady)}
                />
              </label>
            </DropdownItem>
            <DropdownItem onClick={toggleModal}>
              <label>HTTP request</label>
            </DropdownItem>
            <DropdownItem onClick={onReset}>
              <label>Reset</label>
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
        <Button color="primary" onClick={onClear}>
          Clear
        </Button>
      </ButtonGroup>
      <Modal id="requestModal" role="dialog" size="lg" isOpen={modalIsOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Import JSON from an HTTP request</ModalHeader>
        <ModalBody>
          <HttpRequestSource onRequestSucceed={toggleModal} />
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

const onFileChange = (toggleImportDropdown: () => void, onFileContentReady: (s: string) => void) => (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  logInfo('onFileChange')
  toggleImportDropdown()
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
}

const mapStateToProps = () => ({})

export default connect(
  mapStateToProps,
  { onFileContentReady: updateSource, onReset: resetEditor, onClear: clearEditor }
)(memo(withErrorBoundary(LateralMenu)))