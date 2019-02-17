import { Loading } from './Loading'
import * as Loadable from 'react-loadable'

export const LoadableReactSelect = Loadable({
  loading: Loading('ReactSelect'),
  loader: () => import(/* webpackChunkName: "react-select" */ 'react-select'),
})
