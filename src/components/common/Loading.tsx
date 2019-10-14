import * as React from 'react'
import Styles from './Loading.module.scss'

export const Loading = (props: { componentName: string }) => (
    <div className={Styles.loader}>{process.env.NODE_ENV === 'production' ? '' : props.componentName}</div>
)
