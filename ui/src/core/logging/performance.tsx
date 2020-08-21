import { isDebugMode } from 'core/misc/debug'
import Perfume from 'perfume.js'
import { IAnalyticsTrackerOptions } from 'perfume.js/dist/types/types'
import * as React from 'react'
import { ProfilerOnRenderCallback } from 'react'
import { logError, logEvents, logPerf } from './logger'

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

export const logPerfPeriodically = async () => {
    const payload = []
    for (let i = 0; i < 50; i++) {
        if (logEvents.isEmpty()) {
            break
        }
        const entry = logEvents.dequeue()

        payload.push(entry)
    }

    if (payload.length === 0) {
        return
    }
    const logUrl = 'https://us-central1-keyrier-json.cloudfunctions.net/perflogs'

    try {
        await fetch(logUrl, { method: 'POST', body: JSON.stringify(payload) })
    } catch (error) {
        logError('error sending perf logs', error)
    }
}

export function withPerformance<P>(Component: React.ComponentType<P>, name: string): React.FC<P> {
    const WithPerf = ({ ...props }) => {
        const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
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
    return WithPerf
}
