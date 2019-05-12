import _ from 'lodash'
import { lex, tokenVocabulary } from './lexer'
import { tokenMatcher } from 'chevrotain'

describe('Chevrotain Tutorial', () => {
  it('Can Lex a simple input', () => {
    const inputText = 'SELECT column1 FROM table2'
    const lexingResult = lex(inputText)

    expect(lexingResult.errors.length).toBe(0)

    const tokens = lexingResult.tokens
    expect(tokens).toHaveLength(4)
    expect(tokens[0].image).toEqual('SELECT')
    expect(tokens[1].image).toEqual('column1')
    expect(tokens[2].image).toEqual('FROM')
    expect(tokens[3].image).toEqual('table2')

    // tokenMatcher acts as an "instanceof" check for Tokens
    expect(tokenMatcher(tokens[0], tokenVocabulary.Select)).toBeTruthy()
    expect(tokenMatcher(tokens[1], tokenVocabulary.Identifier)).toBeTruthy()
    expect(tokenMatcher(tokens[2], tokenVocabulary.From)).toBeTruthy()
    expect(tokenMatcher(tokens[3], tokenVocabulary.Identifier)).toBeTruthy()
  })
})
