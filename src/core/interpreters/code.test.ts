import { codeEvaluation } from './code'

describe('javascript interpreter helpers', () => {
    it('should eval simple object', () => {
        const result = codeEvaluation('{"a": 1}', 'data.a', 'Javascript')
        expect(result).toEqual('1')
    })

    // it('should return an empty string if no source', () => {
    //     const result = codeEvaluation((null as never) as string, 'data.a', 'Javascript')
    //     expect(result).toEqual('')
    // })

    // it('should return an error if mode is unknown', () => {
    //     const result = codeEvaluation('{"a": 1}', 'data.a', 'FAKE_MODE' as QueryMode)
    //     expect(result).toBeInstanceOf(Error)
    // })

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

    // it('should return an empty string if no query', () => {
    //     const result = codeEvaluation('{"a": 1}', (null as never) as string, 'Javascript')
    //     expect(result).toEqual('')
    // })

    it('should eval empty array', () => {
        const result = codeEvaluation('[]', 'data', 'Javascript')
        expect(result).toEqual('[]')
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
    .map(d => _.pick(d, ['val' ]))
    
    `,
            'Javascript'
        )
        expect(result).toBe('[{"val":42}]')
    })
})
