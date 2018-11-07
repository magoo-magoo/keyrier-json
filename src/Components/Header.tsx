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
import { Theme } from '../Themes/themes';
import { switchTheme } from '../Actions/actions';
import { connect } from 'react-redux';
import { getTheme } from '../Store/selectors';
import { RootState } from '../State/State';

interface Props {
  switchTheme: (theme: Theme) => void;
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

const Header: React.SFC<Props> = ({ switchTheme, currentTheme }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const switchThemeAndReload = (theme: Theme) => {
    switchTheme(theme);
    setTimeout(() => window.location.reload());
  };
  return (
    <>
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
  { switchTheme }
)(Header);
