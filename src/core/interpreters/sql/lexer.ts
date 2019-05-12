import { TokenType, createToken, Lexer } from 'chevrotain'

const tokenVocabulary: { [key: string]: TokenType } = {}

const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z]\w*/ })

const Select = createToken({
  name: 'Select',
  pattern: /SELECT/i,
  longer_alt: Identifier,
})

const From = createToken({
  name: 'From',
  pattern: /FROM/i,
  longer_alt: Identifier,
})
const Where = createToken({
  name: 'Where',
  pattern: /WHERE/i,
  longer_alt: Identifier,
})

const Comma = createToken({ name: 'Comma', pattern: /,/ })
const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ })
const GreaterThan = createToken({ name: 'GreaterThan', pattern: />/ })
const LessThan = createToken({ name: 'LessThan', pattern: /</ })
const WhiteSpace = createToken({
  name: 'WhiteSpace',
  pattern: /\s+/,
  group: Lexer.SKIPPED,
})

// The order of tokens is important
const allTokens = [
  WhiteSpace,
  // "keywords" appear before the Identifier
  Select,
  From,
  Where,
  Comma,
  // The Identifier must appear after the keywords because all keywords are valid identifiers.
  Identifier,
  Integer,
  GreaterThan,
  LessThan,
]

const SelectLexer = new Lexer(allTokens)

allTokens.forEach(tokenType => {
  tokenVocabulary[tokenType.name] = tokenType
})

const lex = (inputText: string) => {
  const lexingResult = SelectLexer.tokenize(inputText)

  if (lexingResult.errors.length > 0) {
    throw Error('Sad Sad Panda, lexing errors detected')
  }

  return lexingResult
}

export { tokenVocabulary, lex }
