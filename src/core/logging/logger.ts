import { isDebugMode } from 'core/misc/debug'
import { getAppVersion } from 'core/misc/utils'

// tslint:disable:no-console

export const logError = (error: string | Error, payload?: any) => {
    console.error('Keyrier', error)
    if (typeof payload !== 'undefined') {
        console.error(payload)
    }
}

export const logWarning = (message: string, payload?: any) => {
    if (typeof payload === 'undefined') {
        console.warn('Keyrier', message)
    } else console.warn('Keyrier', message, payload)
}

export const logDebug = (message: string, payload?: any) => {
    if (typeof payload === 'undefined') {
        console.debug('Keyrier', message)
    } else console.debug('Keyrier', message, payload)
}

export const logPerf = (name: string, duration?: number, customProperties?: any) => {
    if (isDebugMode()) {
        const appVersion = getAppVersion()
        const payload = { name, duration, appVersion, ...customProperties, location: window.location.href }
        logEvents.enqueue(payload)
    }
}

class Queue<T = any> {
    // initialise the queue and offset
    private queue: T[] = []
    private offset = 0

    // Returns the length of the queue.
    public getLength() {
        return this.queue.length - this.offset
    }

    // Returns true if the queue is empty, and false otherwise.
    public isEmpty() {
        return this.queue.length === 0
    }

    /* Enqueues the specified item. The parameter is:
     *
     * item - the item to enqueue
     */
    public enqueue(item: T) {
        this.queue.push(item)
    }

    /* Dequeues an item and returns it. If the queue is empty, the value
     * 'undefined' is returned.
     */
    public dequeue() {
        // if the queue is empty, return immediately
        if (this.queue.length === 0) {
            return undefined
        }

        // store the item at the front of the queue
        const item = this.queue[this.offset]

        // increment the offset and remove the free space if necessary
        if (++this.offset * 2 >= this.queue.length) {
            this.queue = this.queue.slice(this.offset)
            this.offset = 0
        }

        // return the dequeued item
        return item
    }

    /* Returns the item at the front of the queue (without dequeuing it). If the
     * queue is empty then undefined is returned.
     */
    public peek() {
        return this.queue.length > 0 ? this.queue[this.offset] : undefined
    }
}

export const logEvents = new Queue()
;(window as any).__PERF_EVENT_LOGS = logEvents
