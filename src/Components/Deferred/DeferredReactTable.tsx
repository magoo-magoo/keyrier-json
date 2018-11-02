import 'react-table/react-table.css';
import { Loading } from './Loading';

// tslint:disable-next-line:no-var-requires
const Loadable: LoadableExport.Loadable = require('react-loadable');

export const LoadableReactTable = Loadable({
  loading: Loading('ReactTable'),
  loader: async () =>
    import(/* webpackChunkName: "react-table" */ 'react-table'),
});
