import { customToString, containsIgnoreCase, prettyPrintBytes } from './string'

describe('string helpers', () => {
    it('should convert number', () => {
        const result = customToString(42)
        expect(result).toBe('42')
    })

    it('should convert string', () => {
        const result = customToString('toto')
        expect(result).toBe('toto')
    })
    it('should convert falsy boolean', () => {
        const result = customToString(false)
        expect(result).toBe('false')
    })
    it('should convert thruthy boolean', () => {
        const result = customToString(true)
        expect(result).toBe('true')
    })

    it('should convert empty array', () => {
        const result = customToString([])
        expect(result).toBe('')
    })
    it('should convert populated array', () => {
        const result = customToString(['Hello', 'World'])
        expect(result).toBe('Hello,World')
    })
    it('should convert object', () => {
        const result = customToString({ property: 42 })
        expect(result).toBe('{"property":42}')
    })
    it('should returns true when contains part', () => {
        const result = containsIgnoreCase('une longue phrase', 'PhrasE')
        expect(result).toBeTruthy()
    })
    it('should returns false when does not contain part', () => {
        const result = containsIgnoreCase('une longue phrase', 'JAVA')
        expect(result).toBeFalsy()
    })

    it('should print 0 B when size is 0 byte', () => {
        const result = prettyPrintBytes(0)
        expect(result).toEqual('0 B')
    })
    it('should print 0 B when size is 1 byte', () => {
        const result = prettyPrintBytes(1)
        expect(result).toEqual('1 B')
    })
    it('should print -1 kB when size is -1024 bytes', () => {
        const result = prettyPrintBytes(-1024)
        expect(result).toEqual('-1 kB')
    })

    it('should print 1 mB when size is 1048576 bytes', () => {
        const result = prettyPrintBytes(1048576)
        expect(result).toEqual('1 MB')
    })
})
