import * as React from 'react'
import { FC, ReactElement } from 'react'
import { CardHeader } from 'reactstrap'
import styles from './GrabbleHeader.module.scss'

type Props = {
    title: string
    children: ReactElement
}

export const GrabbleHeader: FC<Props> = ({ title, children }) => (
    <div className={styles.draggable}>
        <CardHeader className="border-0" style={{ background: 'transparent' }}>
            <u className="font-weight-bold">{title}</u>
            <span className={`float-right ${styles.grabber}`}>
                <i className="material-icons">drag_indicator</i>
            </span>
        </CardHeader>
        <div className="p-2">{children}</div>
    </div>
)
