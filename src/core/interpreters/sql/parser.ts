import { CstNode, CstParser } from 'chevrotain'
import {
    As,
    Comma,
    Equal,
    From,
    GreaterOrEqualThan,
    GreaterThan,
    Identifier,
    Integer,
    LessOrEqualThan,
    LessThan,
    lex as selectLexer,
    OrAnd,
    Select,
    Star,
    StringToken,
    tokenVocabulary,
    Where,
    Like,
    OrderBy,
    OrderByDirection,
    Limit,
    OpenParenthesis,
    CloseParenthesis,
    In,
    Is,
    Null,
    NotEqual,
    IsNot,
} from './lexer'

export const labels = {
    value: 'value',
    name: 'name',
    alias: 'alias',
    left: 'left',
    right: 'right',
    in: 'in',
} as const

class SelectParser extends CstParser {
    public selectStatement: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode | CstNode[]
    public fromClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public selectClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public whereClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public relationalOperator: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public orderByClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public limitClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public atomicExpression: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public expression: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public subExpression: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public projection: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public cols: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    constructor(config?: any) {
        super(tokenVocabulary, config)

        this.cols = this.RULE('cols', () => {
            this.CONSUME(Identifier, { LABEL: labels.value })
            this.OPTION(() => {
                this.CONSUME(As)
                this.CONSUME2(Identifier, { LABEL: labels.name })
            })
        })

        this.projection = this.RULE('projection', () => {
            this.OR([
                { ALT: () => this.CONSUME(Star) },
                {
                    ALT: () =>
                        this.AT_LEAST_ONE_SEP({
                            SEP: Comma,
                            DEF: () => {
                                this.SUBRULE(this.cols)
                            },
                        }),
                },
            ])
        })

        this.selectStatement = this.RULE('selectStatement', () => {
            this.SUBRULE(this.selectClause)
            this.SUBRULE(this.fromClause)
            this.OPTION(() => {
                this.SUBRULE(this.whereClause)
            })
            this.OPTION2(() => {
                this.SUBRULE(this.orderByClause)
            })
            this.OPTION3(() => {
                this.SUBRULE(this.limitClause)
            })
        })

        this.selectClause = this.RULE('selectClause', () => {
            this.CONSUME(Select)
            this.SUBRULE(this.projection)
        })

        this.fromClause = this.RULE('fromClause', () => {
            this.CONSUME(From)
            this.CONSUME(Identifier)
            this.OPTION(() => this.CONSUME2(Identifier, { LABEL: labels.alias }))
        })

        this.whereClause = this.RULE('whereClause', () => {
            this.CONSUME(Where)
            this.SUBRULE(this.expression)
        })

        this.expression = this.RULE('expression', () => {
            this.MANY_SEP({
                SEP: OrAnd,
                DEF: () => {
                    this.SUBRULE(this.subExpression)

                    return OrAnd.name
                },
            })
        })

        this.subExpression = this.RULE('subExpression', () => {
            this.SUBRULE(this.atomicExpression, { LABEL: labels.left })
            this.SUBRULE(this.relationalOperator)
            this.SUBRULE2(this.atomicExpression, { LABEL: labels.right })
        })

        this.atomicExpression = this.RULE('atomicExpression', () => {
            this.OR([
                { ALT: () => this.CONSUME(Integer) },
                { ALT: () => this.CONSUME(Null) },
                { ALT: () => this.CONSUME(Identifier) },
                { ALT: () => this.CONSUME(StringToken) },
                {
                    ALT: () => {
                        this.CONSUME(OpenParenthesis)
                        this.MANY_SEP({
                            SEP: Comma,
                            DEF: () => {
                                this.OR1([
                                    {
                                        ALT: () => this.CONSUME1(Integer, { LABEL: labels.in }),
                                    },
                                    {
                                        ALT: () => this.CONSUME1(StringToken, { LABEL: labels.in }),
                                    },
                                ])
                            },
                        })
                        this.CONSUME(CloseParenthesis)
                    },
                },
            ])
        })

        this.relationalOperator = this.RULE('relationalOperator', () => {
            this.OR([
                { ALT: () => this.CONSUME(GreaterOrEqualThan) },
                { ALT: () => this.CONSUME(GreaterThan) },
                { ALT: () => this.CONSUME(LessOrEqualThan) },
                { ALT: () => this.CONSUME(LessThan) },
                { ALT: () => this.CONSUME(Equal) },
                { ALT: () => this.CONSUME(NotEqual) },
                { ALT: () => this.CONSUME(Like) },
                { ALT: () => this.CONSUME(In) },
                { ALT: () => this.CONSUME(IsNot) },
                { ALT: () => this.CONSUME(Is) },
            ])
        })

        this.orderByClause = this.RULE('orderByClause', () => {
            this.CONSUME(OrderBy)
            this.CONSUME(Identifier)
            this.OPTION({
                DEF: () => this.CONSUME(OrderByDirection),
            })
        })

        this.limitClause = this.RULE('limitClause', () => {
            this.CONSUME(Limit)
            this.CONSUME(Integer)
        })

        this.performSelfAnalysis()
    }
}

const parserInstance = new SelectParser()

const parse = (inputText: string) => {
    const lexResult = selectLexer(inputText)

    parserInstance.input = lexResult.tokens

    parserInstance.selectStatement()

    if (parserInstance.errors.length > 0) {
        throw Error(parserInstance.errors[0].message)
    }
}

export { parserInstance, SelectParser, parse }
