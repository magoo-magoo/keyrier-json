import { SelectParser } from './parser'
import { CstNode, ICstVisitor } from 'chevrotain'
import { lex } from './lexer'

const parserInstance = new SelectParser([])
// The base visitor class can be accessed via the a parser instance.
const BaseSQLVisitor: new (arg?: any) => ICstVisitor<number, Node> = parserInstance.getBaseCstVisitorConstructor()

export type TreeType = 'SELECT_STMT' | 'SELECT_CLAUSE' | 'FROM_CLAUSE' | 'WHERE_CLAUSE' | 'EXPRESSION'

export type Node = SelectClause | ExpressionNode | FromClause | WhereClause | SelectClause
export type TreeNode = {
  type: TreeType
}
export type SelectClause = {
  columns: readonly string[]
} & TreeNode
export type ExpressionNode = {
  lhs: string
  rhs: string
  operator: string
} & TreeNode
export type FromClause = { table: string } & TreeNode
export type WhereClause = { condition: string } & TreeNode
export type SelectStatementTree = {
  selectClause: SelectClause
  fromClause: FromClause
  whereClause: WhereClause
} & TreeNode

class SQLToAstVisitor extends BaseSQLVisitor {
  constructor() {
    super()
    this.validateVisitor()
  }

  public selectStatement(ctx: {
    selectClause: CstNode | CstNode[]
    fromClause: CstNode | CstNode[]
    whereClause: CstNode | CstNode[]
  }) {
    // "this.visit" can be used to visit none-terminals and will invoke the correct visit method for the CstNode passed.
    const select = this.visit(ctx.selectClause)

    //  "this.visit" can work on either a CstNode or an Array of CstNodes.
    //  If an array is passed (ctx.fromClause is an array) it is equivalent
    //  to passing the first element of that array
    const from = this.visit(ctx.fromClause)

    // "whereClause" is optional, "this.visit" will ignore empty arrays (optional)
    const where = this.visit(ctx.whereClause)

    return {
      type: 'SELECT_STMT',
      selectClause: select,
      fromClause: from,
      whereClause: where,
    } as const
  }

  public selectClause(ctx: { Identifier: Array<{ image: string }> }): SelectClause {
    // Each Terminal or Non-Terminal in a grammar rule are collected into
    // an array with the same name(key) in the ctx object.
    const columns = ctx.Identifier.map((identToken: { image: string }) => identToken.image)

    return {
      type: 'SELECT_CLAUSE',
      columns,
    } as const
  }

  public fromClause(ctx: { Identifier: Array<{ image: string }> }): FromClause {
    const tableName: string = ctx.Identifier[0].image

    return {
      type: 'FROM_CLAUSE',
      table: tableName,
    } as const
  }

  public whereClause(ctx: { expression: CstNode | CstNode[] }) {
    const condition = this.visit(ctx.expression)

    return {
      type: 'WHERE_CLAUSE',
      condition,
    } as const
  }

  public expression(ctx: {
    lhs: Array<CstNode | CstNode[]>
    relationalOperator: CstNode | CstNode[]
    rhs: Array<CstNode | CstNode[]>
  }) {
    // Note the usage of the "rhs" and "lhs" labels defined in step 2 in the expression rule.
    const lhs = this.visit(ctx.lhs[0])
    const operator = this.visit(ctx.relationalOperator)
    const rhs = this.visit(ctx.rhs[0])

    return {
      type: 'EXPRESSION',
      lhs,
      operator,
      rhs,
    } as const
  }

  // these two visitor methods will return a string.
  public atomicExpression(ctx: { Integer: Array<{ image: string }>; Identifier: Array<{ image: string }> }) {
    if (ctx.Integer) {
      return ctx.Integer[0].image
    } else {
      return ctx.Identifier[0].image
    }
  }

  public relationalOperator(ctx: { GreaterThan: Array<{ image: string }>; LessThan: Array<{ image: string }> }) {
    if (ctx.GreaterThan) {
      return ctx.GreaterThan[0].image
    } else {
      return ctx.LessThan[0].image
    }
  }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new SQLToAstVisitor()

const toAst = (inputText: string) => {
  const lexResult = lex(inputText)

  // ".input" is a setter which will reset the parser's internal's state.
  parserInstance.input = lexResult.tokens

  // Automatic CST created when parsing
  const cst = parserInstance.selectStatement()

  if (parserInstance.errors.length > 0) {
    throw Error('Sad sad panda, parsing errors detected!\n' + parserInstance.errors[0].message)
  }

  const ast = toAstVisitorInstance.visit(cst)
  console.log('ast', ast)
  return ast
}

export { toAst }
