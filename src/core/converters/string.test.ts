import { containsIgnoreCase, customToString, prettyPrintBytes, takeFirst } from './string'

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
    it('should convert undefined', () => {
        const result = customToString(undefined)
        expect(result).toBe('')
    })
    it('should convert null', () => {
        const result = customToString(null)
        expect(result).toBe('null')
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
    it('should return true when contains part', () => {
        const result = containsIgnoreCase('une longue phrase', 'PhrasE')
        expect(result).toBeTruthy()
    })

    it.each`
        str                    | part        | expected
        ${''}                  | ${'some'}   | ${false}
        ${'value'}             | ${''}       | ${false}
        ${null}                | ${'test'}   | ${false}
        ${'test'}              | ${null}     | ${false}
        ${'une longue phrase'} | ${'JAVA'}   | ${false}
        ${'une longue phrase'} | ${'PhrasE'} | ${true}
    `('containsIgnoreCase($input, $take) should return $expected', ({ str, part, expected }) => {
        const result = containsIgnoreCase(str, part)

        expect(result).toEqual(expected)
    })

    it.each`
        input        | take  | expected
        ${''}        | ${1}  | ${''}
        ${null}      | ${1}  | ${null}
        ${'foo bar'} | ${-1} | ${'...'}
        ${undefined} | ${1}  | ${null}
        ${'hello'}   | ${2}  | ${'he...'}
        ${'foo'}     | ${4}  | ${'foo'}
        ${'foo'}     | ${3}  | ${'foo'}
        ${'foo'}     | ${2}  | ${'fo...'}
    `('takeFirst($input, $take) should return $expected', ({ input, take, expected }) => {
        const result = takeFirst(input, take)

        expect(result).toEqual(expected)
    })

    it.each`
        input         | expected
        ${-1024}      | ${'-1 kB'}
        ${0}          | ${'0 B'}
        ${0.1}        | ${'0.1 B'}
        ${1}          | ${'1 B'}
        ${1024}       | ${'1 kB'}
        ${1048576}    | ${'1 MB'}
        ${1073741824} | ${'1 GB'}
    `('prettyPrintBytes($input, $take) should return $expected', ({ input, expected }) => {
        const result = prettyPrintBytes(input)

        expect(result).toEqual(expected)
    })
    it.each`
        input
        ${undefined}
        ${null}
        ${'foo'}
        ${'1'}
        ${Infinity}
        ${-Infinity}
    `('prettyPrintBytes($input, $take) should throw', ({ input }) => {
        expect(() => prettyPrintBytes(input)).toThrow()
    })
})
