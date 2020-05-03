import { lex, tokenVocabulary } from './lexer'
import { tokenMatcher } from 'chevrotain'

describe('Lexer', () => {
    it('Can Lex a simple input', () => {
        const inputText = 'SELECT column1 FROM table2 where column1 = 42'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(8)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('column1')
        expect(tokens[2].image).toEqual('FROM')
        expect(tokens[3].image).toEqual('table2')
        expect(tokens[4].image).toEqual('where')
        expect(tokens[5].image).toEqual('column1')
        expect(tokens[6].image).toEqual('=')
        expect(tokens[7].image).toEqual('42')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.Where)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[6], tokenVocabulary.Equal)).toBeTruthy()
        expect(tokenMatcher(tokens[7], tokenVocabulary.Integer)).toBeTruthy()
    })

    it('lex like operator', () => {
        const inputText = "SELECT column1 FROM table2 where column1 like 'foo42'"
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(8)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('column1')
        expect(tokens[2].image).toEqual('FROM')
        expect(tokens[3].image).toEqual('table2')
        expect(tokens[4].image).toEqual('where')
        expect(tokens[5].image).toEqual('column1')
        expect(tokens[6].image).toEqual('like')
        expect(tokens[7].image).toEqual("'foo42'")

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.Where)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[6], tokenVocabulary.Like)).toBeTruthy()
        expect(tokenMatcher(tokens[7], tokenVocabulary.StringToken)).toBeTruthy()
    })
    it('lex not like operator', () => {
        const inputText = "SELECT column1 FROM table2 where column1 not like 'foo42'"
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(8)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('column1')
        expect(tokens[2].image).toEqual('FROM')
        expect(tokens[3].image).toEqual('table2')
        expect(tokens[4].image).toEqual('where')
        expect(tokens[5].image).toEqual('column1')
        expect(tokens[6].image).toEqual('not like')
        expect(tokens[7].image).toEqual("'foo42'")

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.Where)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[6], tokenVocabulary.NotLike)).toBeTruthy()
        expect(tokenMatcher(tokens[7], tokenVocabulary.StringToken)).toBeTruthy()
    })

    it('lex as token', () => {
        const inputText = 'SELECT column1 as foo FROM table2'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(6)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('column1')
        expect(tokens[2].image).toEqual('as')
        expect(tokens[3].image).toEqual('foo')
        expect(tokens[4].image).toEqual('FROM')
        expect(tokens[5].image).toEqual('table2')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.As)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
    })
    it('lex star token', () => {
        const inputText = 'SELECT column1, * FROM table2'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(6)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('column1')
        expect(tokens[2].image).toEqual(',')
        expect(tokens[3].image).toEqual('*')
        expect(tokens[4].image).toEqual('FROM')
        expect(tokens[5].image).toEqual('table2')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.Comma)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Star)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
    })

    it('should accept "." in identifier', () => {
        const inputText = 'SELECT foo.bar FROM table2'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(4)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('foo.bar')
        expect(tokens[2].image).toEqual('FROM')
        expect(tokens[3].image).toEqual('table2')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
    })

    it('should lex order by', () => {
        const inputText = 'SELECT * from table order by foo'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(6)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('*')
        expect(tokens[2].image).toEqual('from')
        expect(tokens[3].image).toEqual('table')
        expect(tokens[4].image).toEqual('order by')
        expect(tokens[5].image).toEqual('foo')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Star)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.OrderBy)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
    })
    it('should lex order by asc', () => {
        const inputText = 'SELECT * from table order by foo asc'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(7)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('*')
        expect(tokens[2].image).toEqual('from')
        expect(tokens[3].image).toEqual('table')
        expect(tokens[4].image).toEqual('order by')
        expect(tokens[5].image).toEqual('foo')
        expect(tokens[6].image).toEqual('asc')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Star)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.OrderBy)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[6], tokenVocabulary.OrderByDirection)).toBeTruthy()
    })
    it('should lex order by desc', () => {
        const inputText = 'SELECT * from table order by foo desc'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(7)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('*')
        expect(tokens[2].image).toEqual('from')
        expect(tokens[3].image).toEqual('table')
        expect(tokens[4].image).toEqual('order by')
        expect(tokens[5].image).toEqual('foo')
        expect(tokens[6].image).toEqual('desc')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Star)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.OrderBy)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[6], tokenVocabulary.OrderByDirection)).toBeTruthy()
    })

    it('should lex comma', () => {
        const inputText = 'SELECT foo, bar from table'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(6)
        expect(tokens[0].image).toEqual('SELECT')
        expect(tokens[1].image).toEqual('foo')
        expect(tokens[2].image).toEqual(',')
        expect(tokens[3].image).toEqual('bar')
        expect(tokens[4].image).toEqual('from')
        expect(tokens[5].image).toEqual('table')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.Comma)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
    })
    it('should lex or expression', () => {
        const inputText = 'select name from data where age = 42 or age = 21'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(12)
        expect(tokens[0].image).toEqual('select')
        expect(tokens[1].image).toEqual('name')
        expect(tokens[2].image).toEqual('from')
        expect(tokens[3].image).toEqual('data')
        expect(tokens[4].image).toEqual('where')
        expect(tokens[5].image).toEqual('age')
        expect(tokens[6].image).toEqual('=')
        expect(tokens[7].image).toEqual('42')
        expect(tokens[8].image).toEqual('or')
        expect(tokens[9].image).toEqual('age')
        expect(tokens[10].image).toEqual('=')
        expect(tokens[11].image).toEqual('21')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.Where)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[6], tokenVocabulary.Equal)).toBeTruthy()
        expect(tokenMatcher(tokens[7], tokenVocabulary.Integer)).toBeTruthy()
        // expect(tokenMatcher(tokens[8], tokenVocabulary.Or)).toBeTruthy()
        expect(tokenMatcher(tokens[9], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[10], tokenVocabulary.Equal)).toBeTruthy()
        expect(tokenMatcher(tokens[11], tokenVocabulary.Integer)).toBeTruthy()
    })
    it('should lex and expression', () => {
        const inputText = 'select name from data where age = 42 and age = 21'
        const lexingResult = lex(inputText)

        expect(lexingResult.errors.length).toBe(0)

        const tokens = lexingResult.tokens
        expect(tokens).toHaveLength(12)
        expect(tokens[0].image).toEqual('select')
        expect(tokens[1].image).toEqual('name')
        expect(tokens[2].image).toEqual('from')
        expect(tokens[3].image).toEqual('data')
        expect(tokens[4].image).toEqual('where')
        expect(tokens[5].image).toEqual('age')
        expect(tokens[6].image).toEqual('=')
        expect(tokens[7].image).toEqual('42')
        expect(tokens[8].image).toEqual('and')
        expect(tokens[9].image).toEqual('age')
        expect(tokens[10].image).toEqual('=')
        expect(tokens[11].image).toEqual('21')

        // tokenMatcher acts as an "instanceof" check for Tokens
        expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
        expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
        expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[4], tokenVocabulary.Where)).toBeTruthy()
        expect(tokenMatcher(tokens[5], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[6], tokenVocabulary.Equal)).toBeTruthy()
        expect(tokenMatcher(tokens[7], tokenVocabulary.Integer)).toBeTruthy()
        // expect(tokenMatcher(tokens[8], tokenVocabulary.And)).toBeTruthy()
        expect(tokenMatcher(tokens[9], tokenVocabulary.Identifier)).toBeTruthy()
        expect(tokenMatcher(tokens[10], tokenVocabulary.Equal)).toBeTruthy()
        expect(tokenMatcher(tokens[11], tokenVocabulary.Integer)).toBeTruthy()
    })
})
