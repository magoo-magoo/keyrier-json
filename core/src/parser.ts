import { CstParser } from 'chevrotain'
import * as lexer from './lexer'

export const labels = {
    value: 'value',
    function: 'function',
    table: 'table',
    name: 'name',
    alias: 'alias',
    left: 'left',
    right: 'right',
    in: 'in',
} as const

class SelectParser extends CstParser {
    public selectStatement: (idxInCallingRule?: number | undefined, ...args: any[]) => any
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
    public joinClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    constructor(config?: any) {
        super(lexer.tokenVocabulary, config)

        this.cols = this.RULE('cols', () => {
            this.OR([
                { ALT: () => this.CONSUME(lexer.Star, { LABEL: labels.value }) },
                {
                    ALT: () => {
                        this.CONSUME2(lexer.Identifier, { LABEL: labels.function })
                        this.CONSUME(lexer.OpenParenthesis)
                        this.CONSUME3(lexer.Identifier, { LABEL: labels.value })
                        this.CONSUME(lexer.CloseParenthesis)
                        this.OPTION1(() => {
                            this.CONSUME1(lexer.As)
                            this.OR3([
                                {
                                    ALT: () => this.CONSUME2(lexer.StringToken, { LABEL: labels.name }),
                                },
                                {
                                    ALT: () => this.CONSUME4(lexer.Identifier, { LABEL: labels.name }),
                                },
                            ])
                        })
                    },
                },
                {
                    ALT: () => {
                        this.OR1([
                            {
                                ALT: () => this.CONSUME(lexer.StringToken, { LABEL: labels.value }),
                            },
                            {
                                ALT: () => this.CONSUME(lexer.Identifier, { LABEL: labels.value }),
                            },
                        ])
                        this.OPTION(() => {
                            this.CONSUME(lexer.As)
                            this.OR2([
                                {
                                    ALT: () => this.CONSUME1(lexer.StringToken, { LABEL: labels.name }),
                                },
                                {
                                    ALT: () => this.CONSUME1(lexer.Identifier, { LABEL: labels.name }),
                                },
                            ])
                        })
                    },
                },
            ])
        })

        this.projection = this.RULE('projection', () => {
            this.OR([
                {
                    ALT: () =>
                        this.AT_LEAST_ONE_SEP({
                            SEP: lexer.Comma,
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
                this.SUBRULE(this.joinClause)
            })

            this.OPTION2(() => {
                this.SUBRULE(this.whereClause)
            })

            this.OPTION3(() => {
                this.SUBRULE(this.orderByClause)
            })
            this.OPTION4(() => {
                this.SUBRULE(this.limitClause)
            })
        })

        this.selectClause = this.RULE('selectClause', () => {
            this.CONSUME(lexer.Select)
            this.SUBRULE(this.projection)
        })

        this.joinClause = this.RULE('joinClause', () => {
            this.MANY(() => {
                this.CONSUME(lexer.InnerJoin)
                this.OR([
                    {
                        ALT: () => this.CONSUME(lexer.Identifier, { LABEL: labels.table }),
                    },
                    {
                        ALT: () => this.CONSUME(lexer.StringToken, { LABEL: labels.table }),
                    },
                ])
                this.OPTION(() => this.CONSUME2(lexer.Identifier, { LABEL: labels.alias }))
                this.CONSUME(lexer.On)
                this.SUBRULE(this.expression)
            })
        })

        this.fromClause = this.RULE('fromClause', () => {
            this.CONSUME(lexer.From)
            this.OR([
                {
                    ALT: () => this.CONSUME(lexer.Identifier, { LABEL: labels.table }),
                },
                {
                    ALT: () => this.CONSUME(lexer.StringToken, { LABEL: labels.table }),
                },
            ])
            this.OPTION(() => this.CONSUME2(lexer.Identifier, { LABEL: labels.alias }))
        })

        this.whereClause = this.RULE('whereClause', () => {
            this.CONSUME(lexer.Where)
            this.SUBRULE(this.expression)
        })

        this.expression = this.RULE('expression', () => {
            this.MANY_SEP({
                SEP: lexer.OrAnd,
                DEF: () => {
                    this.SUBRULE(this.subExpression)

                    return lexer.OrAnd.name
                },
            })
        })

        this.subExpression = this.RULE('subExpression', () => {
            this.SUBRULE(this.atomicExpression, { LABEL: labels.left })
            this.OR([
                {
                    ALT: () => {
                        this.SUBRULE(this.relationalOperator)
                        // this.CONSUME2(In, { LABEL: 'relationalOperator' })
                        this.CONSUME2(lexer.OpenParenthesis)
                        this.SUBRULE3(this.selectStatement, { LABEL: labels.right })
                        this.CONSUME3(lexer.CloseParenthesis)
                    },
                },
                {
                    ALT: () => {
                        this.SUBRULE1(this.relationalOperator)
                        this.SUBRULE2(this.atomicExpression, { LABEL: labels.right })
                    },
                },
            ])
        })

        this.atomicExpression = this.RULE('atomicExpression', () => {
            this.OR([
                { ALT: () => this.CONSUME(lexer.Integer) },
                { ALT: () => this.CONSUME(lexer.Null) },
                { ALT: () => this.CONSUME(lexer.Identifier) },
                { ALT: () => this.CONSUME(lexer.StringToken) },
                {
                    ALT: () => {
                        this.CONSUME(lexer.OpenParenthesis)
                        this.MANY_SEP({
                            SEP: lexer.Comma,
                            DEF: () => {
                                this.OR1([
                                    {
                                        ALT: () => this.CONSUME1(lexer.Integer, { LABEL: labels.in }),
                                    },
                                    {
                                        ALT: () => this.CONSUME1(lexer.StringToken, { LABEL: labels.in }),
                                    },
                                ])
                            },
                        })
                        this.CONSUME(lexer.CloseParenthesis)
                    },
                },
            ])
        })

        this.relationalOperator = this.RULE('relationalOperator', () => {
            this.OR([
                { ALT: () => this.CONSUME(lexer.GreaterOrEqualThan) },
                { ALT: () => this.CONSUME(lexer.GreaterThan) },
                { ALT: () => this.CONSUME(lexer.LessOrEqualThan) },
                { ALT: () => this.CONSUME(lexer.LessThan) },
                { ALT: () => this.CONSUME(lexer.Equal) },
                { ALT: () => this.CONSUME(lexer.NotEqual) },
                { ALT: () => this.CONSUME(lexer.Like) },
                { ALT: () => this.CONSUME(lexer.NotLike) },
                { ALT: () => this.CONSUME(lexer.In) },
                { ALT: () => this.CONSUME(lexer.IsNot) },
                { ALT: () => this.CONSUME(lexer.Is) },
            ])
        })

        this.orderByClause = this.RULE('orderByClause', () => {
            this.CONSUME(lexer.OrderBy)
            this.CONSUME(lexer.Identifier)
            this.OPTION({
                DEF: () => this.CONSUME(lexer.OrderByDirection),
            })
        })

        this.limitClause = this.RULE('limitClause', () => {
            this.CONSUME(lexer.Limit)
            this.CONSUME(lexer.Integer)
        })

        this.performSelfAnalysis()
    }
}
const parserInstance = new SelectParser()

const parse = (inputText: string) => {
    const lexResult = lexer.lex(inputText)

    parserInstance.input = lexResult.tokens

    const cst = parserInstance.selectStatement()

    if (parserInstance.errors.length > 0) {
        throw Error(parserInstance.errors[0].message)
    }
    return cst
}

export { SelectParser, parse }
