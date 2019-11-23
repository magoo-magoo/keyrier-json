import * as React from 'react'
import Styles from './Loading.module.scss'
import { connect } from 'react-redux'
import { getDebugMode } from 'store/selectors'
import { FC } from 'react'

type Props = {
    componentName: string
    debugMode: boolean
}
const Loading: FC<Props> = ({ componentName, debugMode }) => (
    <div className={Styles.loader}>{process.env.NODE_ENV === 'production' && !debugMode ? '' : componentName}</div>
)

export default connect(state => ({ debugMode: getDebugMode(state) }))(Loading)
