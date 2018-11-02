import { Loading } from './Loading';

// tslint:disable-next-line:no-var-requires
const Loadable: LoadableExport.Loadable = require('react-loadable');

export const LoadableReactSelect = Loadable({
  loading: Loading('ReactSelect'),
  loader: () => import(/* webpackChunkName: "react-select" */ 'react-select'),
});
