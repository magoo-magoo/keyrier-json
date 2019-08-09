import { createToken, Lexer } from 'chevrotain'

export const Identifier = createToken({ name: 'Identifier', pattern: /[a-zA-Z]+[\w.]*/ })
export const WhiteSpace = createToken({ name: 'WhiteSpace', pattern: /\s+/, group: Lexer.SKIPPED })
export const Select = createToken({ name: 'Select', pattern: /SELECT/i, longer_alt: Identifier })
export const From = createToken({ name: 'From', pattern: /FROM/i, longer_alt: Identifier })
export const Where = createToken({ name: 'Where', pattern: /WHERE/i, longer_alt: Identifier })
export const Comma = createToken({ name: 'Comma', pattern: /,/ })
export const Like = createToken({ name: 'Like', pattern: /like/i, longer_alt: Identifier })
export const NotLike = createToken({ name: 'NotLike', pattern: /NOT\s+LIKE/i })
export const OrderBy = createToken({ name: 'OrderBy', pattern: /ORDER\sBY+/i })
export const OrderByDirectionAsc = createToken({ name: 'OrderByDirection', pattern: /ASC/i, longer_alt: Identifier })
export const OrderByDirectionDesc = createToken({ name: 'OrderByDirection', pattern: /DESC/i, longer_alt: Identifier })
export const As = createToken({ name: 'As', pattern: /AS/i, longer_alt: Identifier })
export const Or = createToken({ name: 'Or', pattern: /OR/i, longer_alt: Identifier })
export const And = createToken({ name: 'And', pattern: /AND/i, longer_alt: Identifier })
export const Star = createToken({ name: 'Star', pattern: /\*/ })
export const Integer = createToken({ name: 'Integer', pattern: /0|[1-9]\d*/ })
export const StringToken = createToken({ name: 'StringToken', pattern: /'[a-zA-Z0-9]*'/ })
export const GreaterOrEqualThan = createToken({ name: 'GreaterOrEqualThan', pattern: />=/ })
export const GreaterThan = createToken({ name: 'GreaterThan', pattern: />/ })
export const LessOrEqualThan = createToken({ name: 'LessOrEqualThan', pattern: /<=/ })
export const LessThan = createToken({ name: 'LessThan', pattern: /</ })
export const Equal = createToken({ name: 'Equal', pattern: /=/ })

// The order of tokens is important
export const tokenVocabulary = {
    WhiteSpace,
    // "keywords" appear before the Identifier
    Select,
    From,
    Where,
    Comma,
    Like,
    NotLike,
    OrderBy,
    OrderByDirectionDesc,
    OrderByDirectionAsc,
    As,
    Or,
    And,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Identifier,
    Star,
    Integer,
    StringToken,
    GreaterOrEqualThan,
    GreaterThan,
    LessOrEqualThan,
    LessThan,
    Equal,
} as const

const SelectLexer = new Lexer(Object.values(tokenVocabulary))

export const lex = (inputText: string) => {
    const lexingResult = SelectLexer.tokenize(inputText)

    if (lexingResult.errors.length > 0) {
        throw Error(JSON.stringify(lexingResult.errors))
    }

    return lexingResult
}
