import { Loading } from './Loading';
import * as Loadable from 'react-loadable';

export const App = Loadable({
  loading: Loading('App'),
  loader: () => import(/* webpackChunkName: "App" */ '../App'),
});
