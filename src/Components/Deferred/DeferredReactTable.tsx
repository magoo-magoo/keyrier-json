import 'react-table/react-table.css'
import { Loading } from './Loading'
import * as Loadable from 'react-loadable'

export const LoadableReactTable = Loadable({
  loading: Loading('ReactTable'),
  loader: async () => import(/* webpackChunkName: "react-table" */ 'react-table'),
})
