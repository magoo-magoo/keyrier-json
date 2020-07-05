import * as React from 'react'
import { FC, ReactElement } from 'react'
import { useMeasure } from 'react-use'
import { CardHeader } from 'reactstrap'
import styles from './GrabbleHeader.module.scss'

type Props = {
    title: string
    children: ReactElement
}

export const GrabbleHeader: FC<Props> = ({ title, children }) => {
    const [parentref, { height: parentHeight }] = useMeasure<HTMLDivElement>()
    const [headerRef, { height: headerHeight }] = useMeasure<HTMLDivElement>()
    const height = parentHeight - headerHeight * 2 - 2

    return (
        <div ref={parentref} className={`${styles.draggable} h-100 `}>
            <div className="px-2">
                <CardHeader className="border-0 pr-0" style={{ background: 'transparent' }}>
                    <div ref={headerRef}>
                        <u className="font-weight-bold text-large h5">{title}</u>
                        <span className={`float-right ${styles.grabber}`}>
                            <i className="material-icons">drag_indicator</i>
                        </span>
                    </div>
                </CardHeader>
                <div
                    style={{
                        height: `${height}px`,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}
