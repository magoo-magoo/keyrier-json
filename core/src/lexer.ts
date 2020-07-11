import { createToken, Lexer } from 'chevrotain'
import { operators } from './operators'

const stringTokenCharacterRegexString = 'a-zA-Z0-9%\\s-&(){}\\[\\]$\\*!\\\\@/,;:=ë#+-<>?^_'
const stringTokenRegex = new RegExp(`("[${stringTokenCharacterRegexString}']*")|('[${stringTokenCharacterRegexString}"]*')`)

export const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z_]+[\w./]*/ })
export const WhiteSpace = createToken({ name: 'WhiteSpace', pattern: /\s+/, group: Lexer.SKIPPED })
export const Comment = createToken({ name: 'Comment', pattern: /--.*/, group: Lexer.SKIPPED })
export const Select = createToken({ name: 'Select', pattern: /SELECT/i, longer_alt: Identifier })
export const From = createToken({ name: 'From', pattern: /FROM/i, longer_alt: Identifier })
export const Where = createToken({ name: 'Where', pattern: /WHERE/i, longer_alt: Identifier })
export const Comma = createToken({ name: 'Comma', pattern: /,/ })
export const Like = createToken({ name: 'Like', pattern: /like/i, longer_alt: Identifier, label: operators.like })
export const Limit = createToken({ name: 'Limit', pattern: /limit/i, longer_alt: Identifier })
export const Null = createToken({ name: 'Null', pattern: /NULL/i, longer_alt: Identifier })
export const In = createToken({ name: 'In', pattern: /in/i, longer_alt: Identifier, label: operators.in })
export const On = createToken({ name: 'On', pattern: /on/i, longer_alt: Identifier })
export const IsNot = createToken({
    name: 'IsNot',
    pattern: /is\s+not/i,
    longer_alt: Identifier,
    label: operators.isNot,
})
export const Is = createToken({ name: 'Is', pattern: /is/i, longer_alt: Identifier, label: operators.is })
export const NotLike = createToken({ name: 'NotLike', pattern: /NOT\s+LIKE/i, label: operators.notLike })
export const OrderBy = createToken({ name: 'OrderBy', pattern: /ORDER\s+BY+/i })
export const InnerJoin = createToken({ name: 'InnerJoin', pattern: /INNER\s+JOIN/i })
export const OrderByDirection = createToken({
    name: 'OrderByDirection',
    pattern: /(ASC|DESC)/i,
    longer_alt: Identifier,
})
export const As = createToken({ name: 'As', pattern: /AS/i, longer_alt: Identifier })
export const OrAnd = createToken({ name: 'OrAnd', pattern: /(AND|OR)/i, longer_alt: Identifier })
export const Star = createToken({ name: 'Star', pattern: /\*/ })
export const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ })
export const StringToken = createToken({ name: 'StringToken', pattern: stringTokenRegex })
export const GreaterOrEqualThan = createToken({
    name: 'GreaterOrEqualThan',
    pattern: />=/,
    label: operators.greaterOrEqualThan,
})
export const GreaterThan = createToken({ name: 'GreaterThan', pattern: />/, label: operators.greaterThan })
export const LessOrEqualThan = createToken({ name: 'LessOrEqualThan', pattern: /<=/, label: operators.lessOrEqualthan })
export const LessThan = createToken({ name: 'LessThan', pattern: /</, label: operators.lessThan })
export const Equal = createToken({ name: 'Equal', pattern: /=/, label: operators.equal })
export const NotEqual = createToken({ name: 'NotEqual', pattern: /(!=|<>)/, label: operators.notEqual })
export const OpenParenthesis = createToken({ name: 'OpenParenthesis', pattern: /\(/ })
export const CloseParenthesis = createToken({ name: 'CloseParenthesis', pattern: /\)/ })

export const tokenVocabulary = {
    Comment,
    WhiteSpace,
    Select,
    From,
    Where,
    Comma,
    Like,
    Limit,
    Null,
    InnerJoin,
    In,
    On,
    IsNot,
    Is,
    NotLike,
    OrderBy,
    OrderByDirection,
    As,
    OrAnd,

    Identifier,

    Star,
    Integer,
    StringToken,

    Equal,
    NotEqual,
    GreaterOrEqualThan,
    GreaterThan,
    LessOrEqualThan,
    LessThan,

    OpenParenthesis,
    CloseParenthesis,
} as const

export type Token = keyof typeof tokenVocabulary

const SelectLexer = new Lexer(Object.values(tokenVocabulary))

export const lex = (inputText: string) => {
    const lexingResult = SelectLexer.tokenize(inputText)

    if (lexingResult.errors.length > 0) {
        throw Error(JSON.stringify(lexingResult.errors))
    }

    return lexingResult
}
