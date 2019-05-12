import { parse } from './parser'

describe('Chevrotain Tutorial', () => {
  it('Can Parse a simple input', () => {
    const inputText = 'SELECT column1 FROM table2'
    expect(() => parse(inputText)).not.toThrow()
  })

  it('Will throw an error for an invalid input', () => {
    // missing table name
    const inputText = 'SELECT FROM table2'
    expect(() => parse(inputText)).toThrow(
      'expecting at least one iteration which starts with one of these possible Token sequences'
    )
    expect(() => parse(inputText)).toThrow("<[Identifier]>\nbut found: 'FROM'")
  })
})
