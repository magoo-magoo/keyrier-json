import * as React from 'react'
import styles from './GrabbleHeader.module.scss'
import { FC, ReactElement } from 'react'
import { CardHeader } from 'reactstrap'

type Props = {
    title: string
    children: ReactElement
}

export const GrabbleHeader: FC<Props> = ({ title, children }) => (
    <div className={styles.draggable}>
        <CardHeader color="primary">
            <u className="font-weight-bold">{title}</u>
            <span className={`float-right ${styles.grabber}`}>
                <i className="material-icons">drag_indicator</i>
            </span>
        </CardHeader>
        {children}
    </div>
)
