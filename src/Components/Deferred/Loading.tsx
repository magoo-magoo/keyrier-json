import * as React from 'react'
import Styles from './Loading.module.scss'

export const Loading = (componentName: string) => (props: LoadableExport.LoadingComponentProps) => {
  if (props.error) {
    return <div>{props.error}</div>
  }

  return <div className={Styles.loader}>{process.env.NODE_ENV === 'production' ? '' : componentName}</div>
}
