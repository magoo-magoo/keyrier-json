import { Parser, CstNode } from 'chevrotain'
import { lex as selectLexer, tokenVocabulary } from './lexer'

// individual imports, prefer ES6 imports if supported in your runtime/transpiler...
const Select = tokenVocabulary.Select
const From = tokenVocabulary.From
const Where = tokenVocabulary.Where
const Identifier = tokenVocabulary.Identifier
const Integer = tokenVocabulary.Integer
const GreaterThan = tokenVocabulary.GreaterThan
const LessThan = tokenVocabulary.LessThan
const Comma = tokenVocabulary.Comma

// ----------------- parser -----------------
class SelectParser extends Parser {
  public selectStatement: (idxInCallingRule?: number | undefined, ...args: any[]) => CstNode | CstNode[]
  public fromClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
  public selectClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
  public whereClause: (idxInCallingRule?: number | undefined, ...args: any[]) => any
  public relationalOperator: (idxInCallingRule?: number | undefined, ...args: any[]) => any
  public atomicExpression: (idxInCallingRule?: number | undefined, ...args: any[]) => any
  public expression: (idxInCallingRule?: number | undefined, ...args: any[]) => any
  // A config object as a constructor argument is normally not needed.
  // Our tutorial scenario requires a dynamic configuration to support step3 without duplicating code.
  constructor(config?: any) {
    super(tokenVocabulary, config)

    this.selectStatement = this.RULE('selectStatement', () => {
      this.SUBRULE(this.selectClause)
      this.SUBRULE(this.fromClause)
      this.OPTION(() => {
        this.SUBRULE(this.whereClause)
      })
    })

    this.selectClause = this.RULE('selectClause', () => {
      this.CONSUME(Select)
      this.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => {
          this.CONSUME(Identifier)
        },
      })
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
      this.SUBRULE(this.atomicExpression, { LABEL: 'lhs' })
      this.SUBRULE(this.relationalOperator)
      this.SUBRULE2(this.atomicExpression, { LABEL: 'rhs' }) // note the '2' suffix to distinguish
      // from the 'SUBRULE(atomicExpression)'
      // 2 lines above.
    })

    this.atomicExpression = this.RULE('atomicExpression', () => {
      this.OR([{ ALT: () => this.CONSUME(Integer) }, { ALT: () => this.CONSUME(Identifier) }])
    })

    this.relationalOperator = this.RULE('relationalOperator', () => {
      this.OR([{ ALT: () => this.CONSUME(GreaterThan) }, { ALT: () => this.CONSUME(LessThan) }])
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
