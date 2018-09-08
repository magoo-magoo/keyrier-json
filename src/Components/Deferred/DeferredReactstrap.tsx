import { Loading } from "./Loading";

// tslint:disable-next-line:no-var-requires
const Loadable: LoadableExport.Loadable = require("react-loadable");

export const Col = Loadable({
  loading: Loading("Col"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Col" */ "reactstrap/lib/Col")
});
export const Row = Loadable({
  loading: Loading("Row"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Row" */ "reactstrap/lib/Row")
});
export const Button = Loadable({
  loading: Loading("Button"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Button" */ "reactstrap/lib/Button")
});
export const Alert = Loadable({
  loading: Loading("Alert"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Alert" */ "reactstrap/lib/Alert")
});
export const Nav = Loadable({
  loading: Loading("Nav"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Nav" */ "reactstrap/lib/Nav")
});
export const NavItem = Loadable({
  loading: Loading("NavItem"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/NavItem" */ "reactstrap/lib/NavItem")
});
export const NavLink = Loadable({
  loading: Loading("NavLink"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/NavLink" */ "reactstrap/lib/NavLink")
});
export const TabContent = Loadable({
  loading: Loading("TabContent"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/TabContent" */ "reactstrap/lib/TabContent")
});
export const TabPane = Loadable({
  loading: Loading("TabPane"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/TabPane" */ "reactstrap/lib/TabPane")
});
export const Container = Loadable({
  loading: Loading("Container"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Container" */ "reactstrap/lib/Container")
});
export const Navbar = Loadable({
  loading: Loading("Navbar"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Navbar" */ "reactstrap/lib/Navbar")
});
export const NavbarBrand = Loadable({
  loading: Loading("NavbarBrand"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/NavbarBrand" */ "reactstrap/lib/NavbarBrand")
});
export const Modal = Loadable({
  loading: Loading("Modal"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Modal" */ "reactstrap/lib/Modal")
});
export const ModalHeader = Loadable({
  loading: Loading("ModalHeader"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/ModalHeader" */ "reactstrap/lib/ModalHeader")
});
export const ModalBody = Loadable({
  loading: Loading("ModalBody"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/ModalBody" */ "reactstrap/lib/ModalBody")
});
export const ModalFooter = Loadable({
  loading: Loading("ModalFooter"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/ModalFooter" */ "reactstrap/lib/ModalFooter")
});
export const ButtonDropdown = Loadable({
  loading: Loading("ButtonDropdown"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/ButtonDropdown" */ "reactstrap/lib/ButtonDropdown")
});
export const DropdownItem = Loadable({
  loading: Loading("DropdownItem"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/DropdownItem" */ "reactstrap/lib/DropdownItem")
});
export const DropdownMenu = Loadable({
  loading: Loading("DropdownMenu"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/DropdownMenu" */ "reactstrap/lib/DropdownMenu")
});
export const DropdownToggle = Loadable({
  loading: Loading("DropdownToggle"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/DropdownToggle" */ "reactstrap/lib/DropdownToggle")
});
export const Label = Loadable({
  loading: Loading("Label"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Label" */ "reactstrap/lib/Label")
});
export const Input = Loadable({
  loading: Loading("Input"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Input" */ "reactstrap/lib/Input")
});
export const Collapse = Loadable({
  loading: Loading("Collapse"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Collapse" */ "reactstrap/lib/Collapse")
});
export const Progress = Loadable({
  loading: Loading("Progress"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Progress" */ "reactstrap/lib/Progress")
});
export const Form = Loadable({
  loading: Loading("Form"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Form" */ "reactstrap/lib/Form")
});
export const FormGroup = Loadable({
  loading: Loading("FormGroup"),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/FormGroup" */ "reactstrap/lib/FormGroup")
});
