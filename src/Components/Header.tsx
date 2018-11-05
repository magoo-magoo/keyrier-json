import * as React from 'react';
import { version } from '../../package.json';
import {
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Collapse,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
} from './Deferred/DeferredReactstrap';
import { UncontrolledDropdown } from 'reactstrap/lib/Uncontrolled';
import { Theme } from '../Themes/Themes';
import { switchTheme } from '../Actions/actions';
import { connect } from 'react-redux';
import { getTheme } from '../Store/selectors';
import { AppState } from '../State/State';

interface Props {
  switchTheme: (theme: Theme) => void;
  currentTheme: Theme;
}

const availableThemes: Theme[] = ['materia', 'darkly', 'sandstone', 'sketchy'];

const Header: React.SFC<Props> = ({ switchTheme, currentTheme }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const switchThemeAndReload = (theme: Theme) => {
    switchTheme(theme);
    setTimeout(() => window.location.reload(), 250);
  };
  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">Keyrier JSON</NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown>
              <DropdownToggle nav caret>
                Theme
              </DropdownToggle>
              <DropdownMenu right>
                {availableThemes.map(theme => (
                  <DropdownItem
                    active={currentTheme === theme}
                    onClick={() => switchThemeAndReload(theme)}
                  >
                    {theme}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <NavLink href="https://github.com/magoo-magoo/keyrier-json/releases/latest">
                v{version}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/magoo-magoo/keyrier-json">
                GitHub
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

const mapStateToProps = (state: Readonly<AppState>) => ({
  currentTheme: getTheme(state),
});

export default connect(
  mapStateToProps,
  { switchTheme }
)(Header);
