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
    functionParameter: 'functionParameter',
} as const

class SelectParser extends CstParser {
    public readonly selectStatement = this.RULE('selectStatement', () => {
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

    public readonly selectClause = this.RULE('selectClause', () => {
        this.CONSUME(lexer.Select)
        this.SUBRULE(this.projection)
    })

    public readonly projection = this.RULE('projection', () => {
        this.OR([
            {
                ALT: () =>
                    this.AT_LEAST_ONE_SEP({
                        SEP: lexer.Comma,
                        DEF: () => {
                            this.SUBRULE(this.columnClause)
                        },
                    }),
            },
        ])
    })

    public readonly value = this.RULE('value', () => {
        this.OR1([
            { ALT: () => this.CONSUME(lexer.Star, { LABEL: labels.value }) },
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
    })

    public readonly columnClause = this.RULE('columnClause', () => {
        this.OR([
            {
                ALT: () => {
                    this.CONSUME2(lexer.Identifier, { LABEL: labels.function })
                    this.CONSUME(lexer.OpenParenthesis)
                    this.MANY_SEP({
                        SEP: lexer.Comma,
                        DEF: () => {
                            this.SUBRULE2(this.value)
                        },
                    })
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
                    this.SUBRULE(this.value)
                },
            },
        ])
    })

    public readonly fromClause = this.RULE('fromClause', () => {
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

    public readonly whereClause = this.RULE('whereClause', () => {
        this.CONSUME(lexer.Where)
        this.SUBRULE(this.expressionClause)
    })

    public readonly orderByClause = this.RULE('orderByClause', () => {
        this.CONSUME(lexer.OrderBy)
        this.CONSUME(lexer.Identifier)
        this.OPTION({
            DEF: () => this.CONSUME(lexer.OrderByDirection),
        })
    })

    public readonly limitClause = this.RULE('limitClause', () => {
        this.CONSUME(lexer.Limit)
        this.CONSUME(lexer.Integer)
    })

    public readonly joinClause = this.RULE('joinClause', () => {
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
            this.SUBRULE(this.expressionClause)
        })
    })

    public readonly expressionClause = this.RULE('expressionClause', () => {
        this.MANY_SEP({
            SEP: lexer.OrAnd,
            DEF: () => this.SUBRULE(this.subExpression),
        })
    })

    public readonly subExpression = this.RULE('subExpression', () => {
        this.SUBRULE(this.atomicExpression, { LABEL: labels.left })
        this.OR([
            {
                ALT: () => {
                    this.SUBRULE(this.relationalOperator)
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

    public readonly atomicExpression = this.RULE('atomicExpression', () => {
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

    public readonly relationalOperator = this.RULE('relationalOperator', () => {
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

    constructor(config?: any) {
        super(lexer.tokenVocabulary, config)
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
