import Perfume, { IAnalyticsTrackerOptions } from 'perfume.js'
import { isDebugMode } from 'core/misc/debug'
import * as React from 'react'
import { ProfilerOnRenderCallback } from 'react'
import { logPerf } from './logger'

const analyticsTracker = (opt: IAnalyticsTrackerOptions) => {
    logPerf(opt.metricName, opt.duration, opt.data)
}

const options = {
    // Metrics
    firstContentfulPaint: true,
    firstPaint: true,
    firstInputDelay: true,
    dataConsumption: true,
    largestContentfulPaint: true,
    navigationTiming: true,
    // Analytics
    analyticsTracker,
    browserTracker: true,
    // Logging
    logPrefix: 'Perfume.js:',
    logging: false,
    // maxMeasureTime: 18000,
    // maxDataConsumption: 18000,
    warning: true,
    debugging: false,
}

const perfume = isDebugMode() ? new Perfume(options) : null
export const perfStart = (name: string) => {
    if (!perfume) {
        return
    }
    perfume.start(name)
}

export const perfEnd = (name: string) => {
    if (!perfume) {
        return
    }
    perfume.end(name)
}

export const perfEndPaint = (name: string) => {
    if (!perfume) {
        return
    }
    perfume.endPaint(name)
}

export const withPerformance = <P extends object>(Component: React.ComponentType<P>, name: string): React.FC<P> => ({
    ...props
}) => {
    const onRender: ProfilerOnRenderCallback = (
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions
    ) => {
        logPerf(name, actualDuration, {
            type: 'component-render',
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
            interactions,
        })
    }

    return (
        <React.Profiler id={`perf-${name}`} onRender={onRender}>
            <Component {...(props as P)} />
        </React.Profiler>
    )
}
