import { logDebug, logError, logEvents, logPerf, logWarning } from './logger'

describe('logger', () => {
    beforeEach(() => {
        ;(window as any).__DEBUG__ = true
    })

    afterEach(() => {
        ;(window as any).__DEBUG__ = false
        jest.restoreAllMocks()
    })

    it('should not log performance event', () => {
        ;(window as any).__DEBUG__ = false

        logPerf('should not log', 42)

        expect(logEvents.isEmpty()).toBeTruthy()
    })

    it('should log performance event', () => {
        expect(logEvents.dequeue()).toBeUndefined()

        logPerf('event 1', 42, { foo: 'bar' })
        logPerf('event 2', 0, { triple: 'xxx' })
        logPerf('event 3', 100, { prop: 'value' })

        expect(logEvents.getLength()).toBe(3)
        expect(logEvents.isEmpty()).toBe(false)

        const event1 = logEvents.dequeue()
        expect(event1.name).toEqual('event 1')
        expect(event1.duration).toEqual(42)
        expect(event1.foo).toEqual('bar')
        expect(logEvents.getLength()).toBe(2)

        expect(logEvents.peek().name).toEqual('event 2')

        const event2 = logEvents.dequeue()
        expect(event2.name).toEqual('event 2')
        expect(event2.duration).toEqual(0)
        expect(event2.triple).toEqual('xxx')
        expect(logEvents.getLength()).toBe(1)

        const event3 = logEvents.dequeue()
        expect(event3.name).toEqual('event 3')
        expect(event3.duration).toEqual(100)
        expect(event3.prop).toEqual('value')

        expect(logEvents.isEmpty()).toBe(true)
        expect(logEvents.getLength()).toBe(0)
        expect(logEvents.dequeue()).toBeUndefined()
        expect(logEvents.peek()).toBeUndefined()
    })

    it('should log error', () => {
        // arrange
        const errorFunction = jest.spyOn(console, 'error').mockReturnValue()

        // act
        logError('error msg')

        // assert
        expect(errorFunction).toHaveBeenCalledWith('Keyrier', 'error msg')
    })

    it('should log error object', () => {
        // arrange
        const errorFunction = jest.spyOn(console, 'error').mockImplementation()

        // act
        logError('error msg', { prop: 'value' })

        // assert
        expect(errorFunction).toHaveBeenCalledWith('Keyrier', 'error msg')
        expect(errorFunction).toHaveBeenCalledWith({ prop: 'value' })
    })

    it('should log warning object', () => {
        // arrange
        const warnFunction = jest.spyOn(console, 'warn').mockImplementation()

        // act
        logWarning('warn msg', { prop: 'value' })

        // assert
        expect(warnFunction).toHaveBeenCalledWith('Keyrier', 'warn msg', { prop: 'value' })
    })

    it('should log warning', () => {
        // arrange
        const warnFunction = jest.spyOn(console, 'warn').mockImplementation()

        // act
        logWarning('warn msg')

        // assert
        expect(warnFunction).toHaveBeenCalledWith('Keyrier', 'warn msg')
    })

    it('should log debug object', () => {
        // arrange
        const debugFunction = jest.spyOn(console, 'debug').mockImplementation()

        // act
        logDebug('debug msg', { prop: 'value' })

        // assert
        expect(debugFunction).toHaveBeenCalledWith('Keyrier', 'debug msg', { prop: 'value' })
    })

    it('should debug warning', () => {
        // arrange
        const debugFunction = jest.spyOn(console, 'debug').mockImplementation()

        // act
        logDebug('warn msg')

        // assert
        expect(debugFunction).toHaveBeenCalledWith('Keyrier', 'warn msg')
    })
})
