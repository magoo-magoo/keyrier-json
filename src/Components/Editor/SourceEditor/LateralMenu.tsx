import * as React from 'react'
import { connect } from 'react-redux'
import {
  UpdateSource,
  updateSource,
  ResetEditor,
  resetEditor,
  ClearEditor,
  clearEditor,
  updateAutoFormatSource,
  UpdateAutoFormatSource,
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
  FormGroup,
  Label,
  Input,
} from '../../Deferred/DeferredReactstrap'
import { memo, useCallback } from 'react'
import { withErrorBoundary } from '../../Common/ErrorBoundary'
import { getSourceAutoFormat } from '../../../Store/selectors'
import { RootState } from '../../../State/State'

interface Props {
  onFileContentReady: (fileContent: string) => UpdateSource
  changeAutoFormat: (active: boolean) => UpdateAutoFormatSource
  onReset: () => ResetEditor
  onClear: () => ClearEditor
  autoFormat: boolean
}

const LateralMenu: React.FC<Props> = ({ onReset, onFileContentReady, onClear, autoFormat, changeAutoFormat }) => {
  const [dropdownIsOpen, toggleDropdown] = useToggleState()
  const [modalIsOpen, toggleModal] = useToggleState()

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
                  onChange={handleFileChange}
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
      <FormGroup className="pt-4" check={true}>
        <Label check={true}>
          <Input checked={autoFormat} type="checkbox" onChange={handleAutoFormatChange} />
          Auto format
        </Label>
      </FormGroup>
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

const mapStateToProps = (state: RootState) => ({ autoFormat: getSourceAutoFormat(state) })

export default connect(
  mapStateToProps,
  {
    onFileContentReady: updateSource,
    onReset: resetEditor,
    onClear: clearEditor,
    changeAutoFormat: updateAutoFormatSource,
  }
)(memo(withErrorBoundary(LateralMenu)))
