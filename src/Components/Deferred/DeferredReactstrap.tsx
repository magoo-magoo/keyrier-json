import { Loading } from './Loading';

// tslint:disable-next-line:no-var-requires
const Loadable: LoadableExport.Loadable = require('react-loadable');

export const Button = Loadable({
  loading: Loading('Button'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Button" */ 'reactstrap/lib/Button'),
});

export const Alert = Loadable({
  loading: Loading('Alert'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Alert" */ 'reactstrap/lib/Alert'),
});

export const TabContent = Loadable({
  loading: Loading('TabContent'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/TabContent" */ 'reactstrap/lib/TabContent'),
});

export const TabPane = Loadable({
  loading: Loading('TabPane'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/TabPane" */ 'reactstrap/lib/TabPane'),
});

export const Modal = Loadable({
  loading: Loading('Modal'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Modal" */ 'reactstrap/lib/Modal'),
});

export const ModalHeader = Loadable({
  loading: Loading('ModalHeader'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/ModalHeader" */ 'reactstrap/lib/ModalHeader'),
});

export const ModalBody = Loadable({
  loading: Loading('ModalBody'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/ModalBody" */ 'reactstrap/lib/ModalBody'),
});

export const ModalFooter = Loadable({
  loading: Loading('ModalFooter'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/ModalFooter" */ 'reactstrap/lib/ModalFooter'),
});

export const ButtonDropdown = Loadable({
  loading: Loading('ButtonDropdown'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/ButtonDropdown" */ 'reactstrap/lib/ButtonDropdown'),
});

export const DropdownItem = Loadable({
  loading: Loading('DropdownItem'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/DropdownItem" */ 'reactstrap/lib/DropdownItem'),
});

export const DropdownMenu = Loadable({
  loading: Loading('DropdownMenu'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/DropdownMenu" */ 'reactstrap/lib/DropdownMenu'),
});

export const DropdownToggle = Loadable({
  loading: Loading('DropdownToggle'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/DropdownToggle" */ 'reactstrap/lib/DropdownToggle'),
});

export const Collapse = Loadable({
  loading: Loading('Collapse'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Collapse" */ 'reactstrap/lib/Collapse'),
});

export const Form = Loadable({
  loading: Loading('Form'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/Form" */ 'reactstrap/lib/Form'),
});

export const FormGroup = Loadable({
  loading: Loading('FormGroup'),
  loader: async () =>
    await import(/* webpackChunkName: "reactstrap/lib/FormGroup" */ 'reactstrap/lib/FormGroup'),
});
