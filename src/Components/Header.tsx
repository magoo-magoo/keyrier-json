import * as React from 'react';
import { version } from '../../package.json';
import { Theme } from '../Themes/themes';
import { switchTheme } from '../Actions/actions';
import { connect } from 'react-redux';
import { getTheme } from '../Store/selectors';
import { RootState } from '../State/State';
import {
  UncontrolledDropdown,
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
} from 'reactstrap';
import { useState } from 'react';

interface Props {
  setTheme: (theme: Theme) => void;
  currentTheme: Theme | null;
}

const availableThemes: Theme[] = [
  'materia',
  'darkly',
  'sandstone',
  'cosmo',
  'cyborg',
  'flatly',
  'journal',
  'litera',
  'lumen',
  'lux',
  'minty',
  'pulse',
  'simplex',
  'slate',
  'solar',
  'spacelab',
  'superhero',
  'united',
  'yeti',
];

const Header: React.FC<Props> = ({ setTheme, currentTheme }) => {
  const [isOpen, setIsOpen] = useState(false);

  const switchThemeAndReload = (theme: Theme) => {
    setTheme(theme);
    setTimeout(() => window.location.reload());
  };
  return (
    <>
      <Navbar color="dark" dark={true} expand="md">
        <NavbarBrand href="/">Keyrier JSON</NavbarBrand>
        <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
        <Collapse isOpen={isOpen} navbar={true}>
          <Nav className="ml-auto" navbar={true}>
            <UncontrolledDropdown>
              <DropdownToggle nav={true} caret={true}>
                Theme
              </DropdownToggle>
              <DropdownMenu right={true}>
                {availableThemes.map((theme, index) => (
                  <DropdownItem
                    key={index}
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
    </>
  );
};

const mapStateToProps = (state: Readonly<RootState>) => ({
  currentTheme: getTheme(state),
});

export default connect(
  mapStateToProps,
  { setTheme: switchTheme }
)(Header);
