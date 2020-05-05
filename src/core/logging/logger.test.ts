import { logPerf, logEvents } from './logger'

describe('logger', () => {
    beforeEach(() => {
        ;(window as any).__DEBUG__ = true
    })
    afterEach(() => {
        ;(window as any).__DEBUG__ = false
    })
    it('should log performance event', () => {
        logPerf('event 1', 42, { foo: 'bar' })
        logPerf('event 2', 0, { triple: 'xxx' })
        logPerf('event 3', 100, { prop: 'value' })

        expect(logEvents.getLength()).toBe(3)
        expect(logEvents.isEmpty()).toBe(false)

        const event1 = logEvents.dequeue()
        expect(event1.name).toEqual('event 1')
        expect(event1.duration).toEqual(42)
        expect(event1.foo).toEqual('bar')

        const event2 = logEvents.dequeue()
        expect(event2.name).toEqual('event 2')
        expect(event2.duration).toEqual(0)
        expect(event2.triple).toEqual('xxx')

        const event3 = logEvents.dequeue()
        expect(event3.name).toEqual('event 3')
        expect(event3.duration).toEqual(100)
        expect(event3.prop).toEqual('value')

        expect(logEvents.isEmpty()).toBe(true)
        expect(logEvents.getLength()).toBe(0)
    })
})
