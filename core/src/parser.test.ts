import { parse } from './parser'

describe('Chevrotain Tutorial', () => {
    it('Can Parse a simple input', () => {
        const inputText = 'SELECT column1 FROM table2'
        expect(() => parse(inputText)).not.toThrow()
    })

    it('Can Parse a subquery input', () => {
        const inputText = 'SELECT column1 FROM table1 where column1 in (select column2 from table2)'
        const parser = parse(inputText)
        expect(parser).toBeDefined()
    })

    it('Can Parse new line', () => {
        const inputText = `SELECT "\n" FROM table`
        const parser = parse(inputText)
        expect(parser).toBeDefined()
    })

    it('Will throw an error for an invalid input', () => {
        // missing table name
        const inputText = 'SELECT FROM table2'
        expect(() => parse(inputText)).toThrow()
        expect(() => parse(inputText)).toThrow()
    })
})
