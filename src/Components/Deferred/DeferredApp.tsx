import { Loading } from './Loading';

// tslint:disable-next-line:no-var-requires
const Loadable: LoadableExport.Loadable = require('react-loadable');

export const App = Loadable({
  loading: Loading('App'),
  loader: () => import(/* webpackChunkName: "App" */ '../App'),
});
