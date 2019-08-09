import { Parser, CstNode } from 'chevrotain'
import {
    lex as selectLexer,
    tokenVocabulary,
    Select,
    Comma,
    Identifier,
    From,
    Where,
    Integer,
    GreaterThan,
    LessThan,
    As,
    Star,
    GreaterOrEqualThan,
    LessOrEqualThan,
    Equal,
    And,
    // Or,
    StringToken,
} from './lexer'

export const labels = {
    valueAndName: 'valueAndName',
    value: 'value',
    name: 'name',
} as const

// ----------------- parser -----------------
class SelectParser extends Parser {
    public selectStatement: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode | CstNode[]
    public fromClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public selectClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public whereClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public relationalOperator: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public atomicExpression: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public expression: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public projection: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    public cols: (idxInCallingRule?: number | undefined, ...args: any[]) => any
    // A config object as a constructor argument is normally not needed.
    // Our tutorial scenario requires a dynamic configuration to support step3 without duplicating code.
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
        })

        this.selectClause = this.RULE('selectClause', () => {
            this.CONSUME(Select)
            this.SUBRULE(this.projection)
        })

        this.fromClause = this.RULE('fromClause', () => {
            this.CONSUME(From)
            this.CONSUME(Identifier)
        })

        this.whereClause = this.RULE('whereClause', () => {
            this.CONSUME(Where)
            this.SUBRULE(this.expression)
        })

        // The "rhs" and "lhs" (Right/Left Hand Side) labels will provide easy
        // to use names during CST Visitor (step 3a).
        this.expression = this.RULE('expression', () => {
            this.OR([
                {
                    ALT: () =>
                        this.AT_LEAST_ONE_SEP({
                            SEP: And,
                            DEF: () => {
                                this.SUBRULE(this.atomicExpression, { LABEL: 'lhs' })
                                this.SUBRULE(this.relationalOperator)
                                this.SUBRULE2(this.atomicExpression, { LABEL: 'rhs' }) // note the '2' suffix to distinguish
                                // from the 'SUBRULE(atomicExpression)'
                                // 2 lines above.
                                return And.name
                            },
                        }),
                },
            ])
        })

        this.atomicExpression = this.RULE('atomicExpression', () => {
            this.OR([
                { ALT: () => this.CONSUME(Integer) },
                { ALT: () => this.CONSUME(Identifier) },
                { ALT: () => this.CONSUME(StringToken) },
            ])
        })

        this.relationalOperator = this.RULE('relationalOperator', () => {
            this.OR([
                { ALT: () => this.CONSUME(GreaterOrEqualThan) },
                { ALT: () => this.CONSUME(GreaterThan) },
                { ALT: () => this.CONSUME(LessOrEqualThan) },
                { ALT: () => this.CONSUME(LessThan) },
                { ALT: () => this.CONSUME(Equal) },
            ])
        })

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self analysis phase.
        this.performSelfAnalysis()
    }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new SelectParser()

const parse = (inputText: string) => {
    const lexResult = selectLexer(inputText)

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens

    // No semantic actions so this won't return anything yet.
    parserInstance.selectStatement()

    if (parserInstance.errors.length > 0) {
        throw Error('Sad sad panda, parsing errors detected!\n' + parserInstance.errors[0].message)
    }
}

export { parserInstance, SelectParser, parse }
