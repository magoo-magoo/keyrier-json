import * as React from 'react'
import { version } from '../../package.json'
import { Theme, availableThemes } from 'Themes/themes'
import { switchTheme } from 'Actions/actions'
import { connect } from 'react-redux'
import { getTheme } from 'Store/selectors'
import { RootState } from 'State/State'
import { useToggleState } from 'Hooks/hooks'
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
import { withErrorBoundary } from './Common/ErrorBoundary'
import { memo, useCallback, FC } from 'react'

interface Props {
  setTheme: (theme: Theme) => void
  currentTheme: Theme | null
}

const Header: FC<Props> = ({ setTheme, currentTheme }) => {
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
                {availableThemes.map((theme, index) => (
                  <ThemeDropDownItem setTheme={setTheme} key={index} active={currentTheme === theme} theme={theme} />
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

type ThemeDropDownItemProps = {
  theme: Theme
  active: boolean
  setTheme: (theme: Theme) => void
}

const ThemeDropDownItem: FC<ThemeDropDownItemProps> = ({ theme, active, setTheme }) => {
  const onClick = useCallback(() => {
    setTheme(theme)
    setTimeout(() => window.location.reload())
  }, [theme, setTheme])
  return (
    <DropdownItem active={active} onClick={onClick}>
      {theme}
    </DropdownItem>
  )
}

const mapStateToProps = (state: RootState) => ({
  currentTheme: getTheme(state),
})

export default connect(
  mapStateToProps,
  { setTheme: switchTheme }
)(memo(withErrorBoundary(Header)))
