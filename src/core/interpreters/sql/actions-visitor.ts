import { SelectParser } from './parser'
import { CstNode, ICstVisitor, IToken } from 'chevrotain'
import { lex } from './lexer'

const parserInstance = new SelectParser([])
// The base visitor class can be accessed via the a parser instance.
const BaseSQLVisitor: new (arg?: any) => ICstVisitor<number, Node> = parserInstance.getBaseCstVisitorConstructor()

export type TreeType = 'SELECT_STMT' | 'SELECT_CLAUSE' | 'FROM_CLAUSE' | 'WHERE_CLAUSE' | 'EXPRESSION' | 'COLUMNS'

export type Node = SelectClause | ExpressionNode | FromClause | WhereClause | SelectClause | Columns

export type TreeNode = {
    type: TreeType
}

export type SelectClause = {
    columns: Columns
} & TreeNode

export type Columns = {
    values: readonly string[]
    names: readonly string[]
} & TreeNode

export type ExpressionNode = {
    lhs: string
    rhs: string
    operator: string
} & TreeNode

export type FromClause = { table: string } & TreeNode

export type WhereClause = { condition: Condition } & TreeNode

export type Condition = {
    rhs: string | number | Condition
    lhs: string | number | Condition
    operator: ConditionOperator
    type: ConditionType
}

export type ConditionType = 'EXPRESSION'
export type ConditionOperator = '<' | '>' | '<=' | '>=' | '<>' | 'and' | 'or'

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

    public selectClause(ctx: { projection: CstNode | CstNode[] }) {
        // Each Terminal or Non-Terminal in a grammar rule are collected into
        // an array with the same name(key) in the ctx object.
        //         const columns = ctx.Identifier.map(identToken => identToken.image)
        const columns = this.visit(ctx.projection)
        return {
            type: 'SELECT_CLAUSE',
            columns,
        }
    }

    public columns$both() {}
    public columns$single() {}
    public cols(ctx: { name: IToken[]; value: IToken[] }) {
        return {
            name: ctx.name && ctx.name[0] ? ctx.name[0].image : ctx.value[0].image,
            value: ctx.value[0].image,
        }
    }

    public projection(ctx: { cols: CstNode[] }): Columns {
        const cols = ctx.cols.map(x => this.visit(x)) as any
        return {
            type: 'COLUMNS',
            values: cols.map((x: { value: any }) => x.value),
            names: cols.map((x: { name: any }) => x.name),
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
    public atomicExpression(ctx: {
        Integer: Array<{ image: any }>
        Identifier: Array<{ image: any }>
        StringToken: Array<{ image: any }>
    }) {
        if (ctx.Integer) {
            return ctx.Integer[0].image
        }
        if (ctx.Identifier) {
            return ctx.Identifier[0].image
        }
        if (ctx.StringToken) {
            return ctx.StringToken[0].image
        }
    }

    public relationalOperator(ctx: {
        GreaterThan: Array<{ image: any }>
        LessThan: Array<{ image: any }>
        Equal: Array<{ image: any }>
    }) {
        if (ctx.GreaterThan) {
            return ctx.GreaterThan[0].image
        }

        if (ctx.LessThan) {
            return ctx.LessThan[0].image
        }
        if (ctx.Equal) {
            return ctx.Equal[0].image
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
        throw Error(JSON.stringify(parserInstance.errors))
    }

    const ast = toAstVisitorInstance.visit(cst)
    return (ast as unknown) as SelectStatementTree
}

export { toAst }
