import { CstNode, ICstVisitor, IToken } from 'chevrotain'
import { Conditions, Field, Limit, nodes, Order, OrderArgument, Source, SQLTree } from 'sql-parser'
import { Integer, lex } from './lexer'
import { SelectParser } from './parser'

const parserInstance = new SelectParser([])
// The base visitor class can be accessed via the a parser instance.
const BaseSQLVisitor: new (arg?: any) => ICstVisitor<number, any> = parserInstance.getBaseCstVisitorConstructor()

class SQLToAstVisitor extends BaseSQLVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    public selectStatement(ctx: {
        selectClause: CstNode | CstNode[]
        fromClause: CstNode | CstNode[]
        whereClause: CstNode | CstNode[]
        orderByClause: CstNode | CstNode[]
        limitClause: CstNode | CstNode[]
    }) {
        const select = this.visit(ctx.selectClause)
        const from = this.visit(ctx.fromClause)
        const where = this.visit(ctx.whereClause)
        const order = this.visit(ctx.orderByClause)
        const limit = this.visit(ctx.limitClause)
        return {
            type: 'SELECT_STMT',
            fields: select,
            source: from,
            where,
            order,
            limit,
        } as const
    }

    public selectClause(ctx: { projection: CstNode | CstNode[] }) {
        // Each Terminal or Non-Terminal in a grammar rule are collected into
        // an array with the same name(key) in the ctx object.
        //         const columns = ctx.Identifier.map(identToken => identToken.image)
        const columns = this.visit(ctx.projection)
        return columns
    }

    public columns$both() {}
    public columns$single() {}
    public cols(ctx: { name: IToken[]; value: IToken[] }) {
        return {
            name: ctx.name && ctx.name[0] ? ctx.name[0].image : ctx.value[0].image,
            value: ctx.value[0].image,
        }
    }

    public projection(ctx: { cols: CstNode[]; Star: CstNode }) {
        const cols: { value: string; name: string }[] = (ctx.cols?.map(x => this.visit(x)) ?? []) as any
        if (ctx.Star) {
            return [new nodes.Star()]
        }
        const fields: Field[] = []
        cols.forEach(({ name, value }) => {
            const { pathArray: namePathArray, propertyName: namePropertyName } = splitPropertyPath(name)
            const { pathArray: fieldPathArray, propertyName: fieldPropertyName } = splitPropertyPath(value)
            const field: Field = {
                name: {
                    value: namePropertyName,
                    values: namePathArray,
                    value2: name,
                },
                field: {
                    value: fieldPropertyName,
                    values: fieldPathArray,
                    value2: value,
                },
            }
            fields.push(field)
        })
        return fields
    }

    public fromClause(ctx: { Identifier: Array<IToken>; alias: Array<IToken> }): Source {
        const tableName: string = ctx.Identifier[0].image
        const alias = ctx.alias?.length ? ctx.alias[0].image : tableName
        return {
            name: {
                value: tableName,
                values: splitPropertyPath(tableName).pathArray,
                value2: tableName,
            },
            alias: {
                value: alias,
                values: splitPropertyPath(alias).pathArray,
            },
        }
    }

    public whereClause(ctx: { expression: CstNode | CstNode[] }) {
        const conditions = this.visit(ctx.expression)

        return {
            type: 'WHERE_CLAUSE',
            conditions,
        } as const
    }

    public limitClause(ctx: { Integer: IToken[] }): Limit {
        const limit = parseInt(ctx.Integer[0].image)
        return {
            value: {
                value: limit,
                values: [limit],
            },
        }
    }
    public orderByClause(ctx: { OrderBy: IToken[]; Identifier: IToken[]; OrderByDirection: IToken[] }): Order {
        const { pathArray, propertyName } = splitPropertyPath(ctx.Identifier[0].image)
        const direction =
            ctx.OrderByDirection && ctx.OrderByDirection?.length
                ? ctx.OrderByDirection[0].image === 'asc'
                    ? 'asc'
                    : 'desc'
                : 'asc'
        const order: OrderArgument = {
            value: {
                value: propertyName,
                values: pathArray,
                value2: propertyName,
            },
            direction,
        }

        return {
            orderings: [order],
        }
    }

    public expression(
        ctx: {
            subExpression: Array<CstNode | CstNode[]>
            OrAnd: Array<IToken>
            right: Array<CstNode | CstNode[]>
        },
        i: number = 0
    ): Conditions {
        if (ctx.subExpression?.length - i === 1) {
            const left = this.visit(ctx.subExpression[i])
            return left
        }
        const left = this.visit(ctx.subExpression[i])

        const operation = this.OrAnd(ctx.OrAnd[i])
        const right = this.expression(ctx, ++i)

        return {
            left,
            right,
            operation,
        }
    }

    public subExpression(ctx: {
        left: Array<CstNode | CstNode[]>
        relationalOperator: CstNode | CstNode[]
        right: Array<CstNode | CstNode[]>
    }) {
        // Note the usage of the "rhs" and "lhs" labels defined in step 2 in the expression rule.
        const left = this.visit(ctx.left[0])
        const operation = this.visit(ctx.relationalOperator)
        const right = this.visit(ctx.right[0])

        return {
            left: { value: left, values: splitPropertyPath(left).pathArray },
            operation,
            right: { value: right, values: splitPropertyPath(right).pathArray },
        }
    }

    // these two visitor methods will return a string.
    public atomicExpression(ctx: {
        Integer: Array<IToken>
        Identifier: Array<IToken>
        StringToken: Array<IToken>
        in: Array<IToken>
        Null: Array<IToken>
    }) {
        if (ctx.in) {
            return ctx.in
                .map(x => {
                    if (x.tokenType === Integer) {
                        return parseInt(x.image)
                    }
                    return x.image
                })
                .map(value => ({ value }))
        }
        if (ctx.Integer) {
            return parseInt(ctx.Integer[0].image)
        }
        if (ctx.Null) {
            return null
        }
        if (ctx.Identifier) {
            return ctx.Identifier[0].image
        }
        if (ctx.StringToken) {
            return ctx.StringToken[0].image.substring(1, ctx.StringToken[0].image.length - 1)
        }
        throw new Error('unknown atomicExpression')
    }

    public relationalOperator(ctx: {
        GreaterThan: Array<IToken>
        GreaterOrEqualThan: Array<IToken>
        LessThan: Array<IToken>
        LessOrEqualThan: Array<IToken>
        Equal: Array<IToken>
        NotEqual: Array<IToken>
        Like: Array<IToken>
        In: Array<IToken>
        Is: Array<IToken>
        IsNot: Array<IToken>
    }) {
        if (ctx.GreaterThan) {
            return ctx.GreaterThan[0].image
        }
        if (ctx.GreaterOrEqualThan) {
            return ctx.GreaterOrEqualThan[0].image
        }
        if (ctx.LessThan) {
            return ctx.LessThan[0].image
        }
        if (ctx.LessOrEqualThan) {
            return ctx.LessOrEqualThan[0].image
        }
        if (ctx.Equal) {
            return ctx.Equal[0].image
        }
        if (ctx.NotEqual) {
            return ctx.NotEqual[0].image
        }
        if (ctx.Like) {
            return ctx.Like[0].image
        }
        if (ctx.In) {
            return ctx.In[0].image
        }
        if (ctx.Is) {
            return ctx.Is[0].image
        }
        if (ctx.IsNot) {
            return ctx.IsNot[0].image
        }
        throw new Error('unknown relationalOperator')
    }
    public OrAnd(token: IToken) {
        return token.image
    }
}

// Our visitor has no state, so a single instance is sufficient.
const toAstVisitorInstance = new SQLToAstVisitor()

const toAst = (inputText: string) => {
    const lexResult = lex(inputText)

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens
    let cst: CstNode[] | CstNode

    try {
        cst = parserInstance.selectStatement()
    } catch (error) {
        console.log(error)
        throw Error(JSON.stringify(error))
    }
    // Automatic CST created when parsing

    if (parserInstance.errors.length > 0) {
        console.log(parserInstance.errors)
        throw Error(JSON.stringify(parserInstance.errors))
    }
    try {
        const ast = toAstVisitorInstance.visit(cst)
        return (ast as unknown) as SQLTree
    } catch (error) {
        console.log(error)
        throw error
    }
}

const splitPropertyPath = (stringPath: string) => {
    if (typeof stringPath !== 'string') {
        return { propertyName: '', pathArray: [] }
    }
    const pathArray = stringPath.split('.')

    return { propertyName: pathArray[pathArray.length - 1], pathArray }
}

export { toAst }
