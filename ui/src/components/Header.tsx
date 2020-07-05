import Actions from 'actions/actions'
import { withPerformance } from 'core/logging/performance'
import { useToggleState } from 'hooks/hooks'
import * as React from 'react'
import { FC, memo, useCallback } from 'react'
import { connect } from 'react-redux'
import {
    Collapse,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink,
} from 'reactstrap'
import { RootState } from 'state/State'
import { getEditorTheme, getTheme } from 'store/selectors'
import { availableEditorThemes, availableGeneralThemes, EditorTheme, GeneralTheme } from 'themes/themes'
import { version } from '../../package.json'
import { withErrorBoundary } from './common/ErrorBoundary'

interface Props {
    setGeneralTheme: typeof Actions.switchTheme
    setEditorTheme: typeof Actions.switchEditorTheme
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
                <NavbarToggler role="presentation" onClick={switchIsOpen} />
                <Collapse isOpen={isOpen} navbar={true}>
                    <Nav className="ml-auto" navbar={true}>
                        <NavItem>
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
                        </NavItem>
                        <NavItem>
                            <NavLink href="https://github.com/magoo-magoo/keyrier-json/releases/latest">
                                v{version}
                            </NavLink>
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

export default connect(mapStateToProps, {
    setGeneralTheme: Actions.switchTheme,
    setEditorTheme: Actions.switchEditorTheme,
})(memo(withErrorBoundary(withPerformance(Header, 'Header'))))
