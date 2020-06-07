import { get, jsonParseSafe } from './utils'

describe('json helpers', () => {
    it('should parse simple object', () => {
        const result = jsonParseSafe('{"a": 1}')
        expect(result).toEqual({ a: 1 })
    })
    it('should parse empty object', () => {
        const result = jsonParseSafe('{}')
        expect(result).toEqual({})
    })

    it('should parse wrong format', () => {
        const result = jsonParseSafe('{wrong JSON}')
        expect(result).toEqual('{wrong JSON}')
    })
    it('should parse empty', () => {
        const result = jsonParseSafe('')
        expect(result).toBeNull()
    })
    it('should parse null', () => {
        const result = jsonParseSafe(null as any)
        expect(result).toBeNull()
    })
    it('should parse undefined', () => {
        const result = jsonParseSafe(undefined as any)
        expect(result).toBeNull()
    })
    it('should parse undefined', () => {
        const result = jsonParseSafe(undefined as any)
        expect(result).toBeNull()
    })

    it('should parse undefined', () => {
        const result = jsonParseSafe(`
        [
            {
              "col1": "\\\\\\n'"
            }
          ]
        `)
        expect(result).toEqual([
            {
                col1: "\\\n'",
            },
        ])
    })

    it('should parse special char', () => {
        const result = jsonParseSafe(' [\r\n  {"foo": "s\'t\\"r\'\\t             \\n &\\b"   }   ]  \t  ')
        expect(result).toEqual([{ foo: "s't\"r'\t             \n &\b" }])
    })
    it('should parse json string with special character', () => {
        const result = jsonParseSafe(`
    {
          "x" : "Hello"      ,
        "1" :"World",
        "foo" : ""

    }
    `)
        expect(result).toEqual({ x: 'Hello', '1': 'World', foo: '' })
    })

    it.each`
        input          | expected
        ${''}          | ${null}
        ${'     '}     | ${null}
        ${null}        | ${null}
        ${undefined}   | ${null}
        ${'hello'}     | ${'hello'}
        ${1}           | ${null}
        ${BigInt('1')} | ${null}
    `('jsonParseSafe $input should return "$expected"', ({ input, expected }) => {
        const result = jsonParseSafe(input)

        expect(result).toEqual(expected)
    })

    it('should get emptry prop', () => {
        const result = get({ foo: {} }, ['foo'])
        expect(result).toEqual({})
    })

    it('should return not found when prop does not exist', () => {
        const result = get({ foofoo: 'value' }, ['foo'])
        expect(result).toEqual(undefined)
    })

    it('should return not found when prop does not exist', () => {
        const result = get({ foofoo: 'value' }, [])
        expect(result).toEqual(undefined)
    })

    it('should return not found when prop does not exist', () => {
        const result = get({ foofoo: 'value' }, [(undefined as unknown) as string])
        expect(result).toEqual(undefined)
    })
})
