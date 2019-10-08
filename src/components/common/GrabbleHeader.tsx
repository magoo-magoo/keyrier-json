import * as React from 'react'
import styles from './GrabbleHeader.module.scss'
import { ComponentType, FC, ReactElement } from 'react'
import { CardHeader } from 'reactstrap'

export const WitXhGrabbleHeader = <T extends {}>(Wrapped: ComponentType<T>) => (
    props: T & {
        title: string
    }
) => {
    const { title, ...restProps } = props
    return (
        <div className={styles.draggable}>
            <div className="card-header">
                {title}
                <span className={`${styles.grabber}`}>
                    <i className="material-icons">drag_indicator</i>
                </span>
            </div>
            <Wrapped {...((restProps as unknown) as T)} />
        </div>
    )
}

type Props = {
    title: string
    children: ReactElement
}

export const GrabbleHeader: FC<Props> = ({ title, children }) => (
    <div className={styles.draggable}>
        <CardHeader color="primary">
            {title}
            <span className={`float-right ${styles.grabber}`}>
                <i className="material-icons">drag_indicator</i>
            </span>
        </CardHeader>
        {children}
    </div>
)
