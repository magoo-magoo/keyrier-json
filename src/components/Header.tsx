import * as React from 'react'
import { version } from '../../package.json'
import { GeneralTheme, availableGeneralThemes, availableEditorThemes, EditorTheme } from 'themes/themes'
import { switchTheme, switchEditorTheme } from 'actions/actions'
import { connect } from 'react-redux'
import { getTheme, getEditorTheme } from 'store/selectors'
import { RootState } from 'state/State'
import { useToggleState } from 'hooks/hooks'
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavItem,
  NavLink,
  Dropdown,
} from 'reactstrap'
import { withErrorBoundary } from './common/ErrorBoundary'
import { memo, useCallback, FC } from 'react'

interface Props {
  setGeneralTheme: typeof switchTheme
  setEditorTheme: typeof switchEditorTheme
  currentTheme: GeneralTheme | null
  currentEditorTheme: EditorTheme
}

const Header: FC<Props> = ({ setGeneralTheme, currentTheme, setEditorTheme, currentEditorTheme }) => {
  const [isOpen, switchIsOpen] = useToggleState()
  const [dropDownIsOpen, toggleDropdown] = useToggleState()

  return (
    <>
      <Navbar color="dark" dark={true} expand="md">
        <NavbarBrand href="/">Keyrier JSON</NavbarBrand>
        <NavbarToggler onClick={switchIsOpen} />
        <Collapse isOpen={isOpen} navbar={true}>
          <Nav className="ml-auto" navbar={true}>
            <Dropdown isOpen={dropDownIsOpen} toggle={toggleDropdown}>
              <DropdownToggle nav={true} caret={true}>
                Theme
              </DropdownToggle>
              <DropdownMenu right={true}>
                <DropdownItem header={true}>Choose editor theme</DropdownItem>
                {availableEditorThemes.map((theme, index) => (
                  <ThemeDropDownItem
                    setTheme={setEditorTheme}
                    key={index}
                    active={currentEditorTheme === theme}
                    theme={theme}
                    reloadOnChange={false}
                  />
                ))}
                <DropdownItem header={true}>Choose general theme</DropdownItem>

                {availableGeneralThemes.map((theme, index) => (
                  <ThemeDropDownItem
                    setTheme={setGeneralTheme}
                    key={index}
                    active={currentTheme === theme}
                    theme={theme}
                    reloadOnChange={true}
                  />
                ))}
              </DropdownMenu>
            </Dropdown>
            <NavItem>
              <NavLink href="https://github.com/magoo-magoo/keyrier-json/releases/latest">v{version}</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/magoo-magoo/keyrier-json">GitHub</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  )
}

type ThemeDropDownItemProps<T extends GeneralTheme | EditorTheme> = {
  theme: T
  active: boolean
  setTheme: (v: T) => void
  reloadOnChange: boolean
}

const ThemeDropDownItem = <T extends GeneralTheme | EditorTheme>(props: ThemeDropDownItemProps<T>) => {
  const { theme, active, setTheme, reloadOnChange } = props
  const onClick = useCallback(() => {
    setTheme(theme)
    if (reloadOnChange) {
      setTimeout(() => window.location.reload())
    }
  }, [theme, setTheme, reloadOnChange])
  return (
    <DropdownItem active={active} onClick={onClick}>
      {theme}
    </DropdownItem>
  )
}

const mapStateToProps = (state: RootState) => ({
  currentTheme: getTheme(state),
  currentEditorTheme: getEditorTheme(state),
})

export default connect(
  mapStateToProps,
  { setGeneralTheme: switchTheme, setEditorTheme: switchEditorTheme }
)(memo(withErrorBoundary(Header)))
