import { codeEvaluation } from './code'

describe('javascript interpreter helpers', () => {
    it('should eval simple object', () => {
        const result = codeEvaluation('{"a": 1}', 'data.a', 'Javascript')
        expect(result.text).toEqual('1')
    })

    it.each`
        source    | query     | mode            | expected
        ${''}     | ${'data'} | ${'Javascript'} | ${null}
        ${'   '}  | ${'data'} | ${'Javascript'} | ${null}
        ${'[]'}   | ${''}     | ${'Javascript'} | ${null}
        ${'[]'}   | ${'    '} | ${'Javascript'} | ${null}
        ${'[]'}   | ${'    '} | ${'SQL'}        | ${null}
        ${'    '} | ${'    '} | ${'SQL'}        | ${null}
        ${'   '}  | ${'    '} | ${'Javascript'} | ${null}
        ${null}   | ${'data'} | ${'Javascript'} | ${null}
        ${'[]'}   | ${null}   | ${'Javascript'} | ${null}
        ${'[]'}   | ${'data'} | ${'FakeMode'}   | ${new Error('unsupported mode')}
    `('source: $source, query: $query, mode: $mode', ({ source, query, mode, expected }) => {
        const result = codeEvaluation(source, query, mode)
        expect(result).toEqual(expected)
    })

    it('should eval empty array', () => {
        const result = codeEvaluation('[]', 'data', 'Javascript')
        expect(result.text).toEqual('[]')
        expect(result.obj).toEqual([])
    })

    it('should return an error with bad code', () => {
        const result = codeEvaluation('{"a": 1}', 'data.', 'Javascript')
        expect(result).toBeInstanceOf(Error)
    })

    it('should eval code with lodash', () => {
        const result = codeEvaluation(
            '{"results": [{"val": 42, "notMapped": "toto"}]}',
            `
    _.chain(data)
    .get('results')
    .map(d => _.pick(d, ['val' ])).value()
    
    `,
            'Javascript'
        )
        expect(result.text).toEqual('[{"val":42}]')
        expect(result.obj).toEqual([{ val: 42 }])
    })
})
