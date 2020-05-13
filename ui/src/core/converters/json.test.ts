import { jsonBeautify } from './json'

describe('json helpers', () => {
    it.each`
        input          | expected
        ${''}          | ${''}
        ${'     '}     | ${''}
        ${null}        | ${''}
        ${undefined}   | ${''}
        ${'hello'}     | ${'hello'}
        ${1}           | ${''}
        ${BigInt('1')} | ${''}
    `('jsonBeautify $input should return "$expected"', ({ input, expected }) => {
        const result = jsonBeautify(input)

        expect(result).toEqual(expected)
    })
    it('jsonBeautify should not change semantic', () => {
        const result = jsonBeautify(`{   "field1":   "Value1",
    "field2": "Value2",
    
    "field3"             : 3    }`)

        expect(JSON.parse(result)).toEqual({
            field1: 'Value1',
            field2: 'Value2',
            field3: 3,
        })
    })
    it('jsonBeautify should return string', () => {
        const result = jsonBeautify(`toto`)

        expect(result).toEqual('toto')
    })
})
