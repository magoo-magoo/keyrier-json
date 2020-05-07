import { CstNode, ICstVisitor, IToken } from 'chevrotain'
import { Field, Op, Order, OrderArgument, Source, SQLTree } from 'sql-parser'
import { Integer, lex, Token, tokenVocabulary } from './lexer'
import { SelectParser } from './parser'

const parserInstance = new SelectParser()
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
            fields: select,
            source: from,
            where,
            order,
            limit,
        } as const
    }

    public selectClause(ctx: { projection: CstNode | CstNode[] }) {
        const columns = this.visit(ctx.projection)
        return columns
    }

    public cols(ctx: { name: IToken[]; value: IToken[] }) {
        let value = ctx.value[0].image

        if (ctx.value[0].tokenType === tokenVocabulary.StringToken) {
            value = convertStringTokenToJsString(value)
        }

        let name = ctx.name && ctx.name[0] ? ctx.name[0].image : value

        if (ctx.name && ctx.name[0].tokenType === tokenVocabulary.StringToken) {
            name = convertStringTokenToJsString(name)
        }
        return {
            name,
            value,
        }
    }

    public projection(ctx: { cols: CstNode[] }) {
        const cols: { value: string; name: string }[] = ctx.cols.map(x => this.visit(x)) as any
        const fields: Field[] = []
        cols.forEach(({ name, value }) => {
            const { pathArray: namePathArray, propertyName: namePropertyName } = splitPropertyPath(name)
            const { pathArray: fieldPathArray, propertyName: fieldPropertyName } = splitPropertyPath(value)
            const field: Field = {
                name: {
                    value: namePropertyName,
                    values: namePathArray,
                },
                field: {
                    value: fieldPropertyName,
                    values: fieldPathArray,
                },
            }
            fields.push(field)
        })
        return fields
    }

    public fromClause(ctx: { table: Array<IToken>; alias: Array<IToken> }): Source {
        let tableName: string = ctx.table[0].image
        if (ctx.table[0].tokenType === tokenVocabulary.StringToken) {
            tableName = convertStringTokenToJsString(tableName)
        }
        const alias = ctx.alias?.length ? ctx.alias[0].image : tableName
        return {
            name: {
                value: tableName,
                values: splitPropertyPath(tableName).pathArray,
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
            conditions,
        } as const
    }

    public limitClause(ctx: { Integer: IToken[] }) {
        const limit = parseInt(ctx.Integer[0].image)
        return {
            value: {
                value: limit,
            },
        }
    }
    public orderByClause(ctx: { OrderBy: IToken[]; Identifier: IToken[]; OrderByDirection: IToken[] }): Order {
        const { pathArray, propertyName } = splitPropertyPath(ctx.Identifier[0].image)
        const direction = ctx.OrderByDirection && (ctx.OrderByDirection[0].image as 'asc' | 'desc')

        const order: OrderArgument = {
            value: {
                value: propertyName,
                values: pathArray,
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
    ) {
        if (ctx.subExpression?.length - i === 1) {
            const left = this.visit(ctx.subExpression[i])
            return left
        }
        const left = this.visit(ctx.subExpression[i])

        const operation = this.OrAnd(ctx.OrAnd[i])
        const right: Op = this.expression(ctx, ++i)

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
        const left = this.visit(ctx.left[0])
        const operation = this.visit(ctx.relationalOperator)
        const right = this.visit(ctx.right[0])

        return {
            left: { value: left, values: splitPropertyPath(left).pathArray },
            operation,
            right: { value: right, values: splitPropertyPath(right).pathArray },
        }
    }

    public atomicExpression(context: Record<Token | 'in', Array<IToken>>) {
        const entries = Object.entries(context) as [keyof typeof context, Array<IToken>][]
        for (let [key, value] of entries) {
            if (key === 'in') {
                return value
                    .map(x => {
                        if (x.tokenType === Integer) {
                            return parseInt(x.image)
                        }
                        return convertStringTokenToJsString(x.image)
                    })
                    .map(value => ({ value }))
            }
            if (key === 'Integer') {
                return parseInt(value[0].image)
            }
            if (key === 'Null') {
                return null
            }
            if (key === 'Identifier') {
                return value[0].image
            }
            if (key === 'StringToken') {
                return convertStringTokenToJsString(value[0].image)
            }
        }
        return null
    }

    public relationalOperator(ctx: Record<Token, Array<IToken>>) {
        const values = Object.values(ctx)
        return values[0][0].image
    }

    public OrAnd(token: IToken) {
        return token.image
    }
}

const toAstVisitorInstance = new SQLToAstVisitor()

const toAst = (inputText: string) => {
    const lexResult = lex(inputText)

    parserInstance.input = lexResult.tokens
    let cst: CstNode[] | CstNode

    cst = parserInstance.selectStatement()

    if (parserInstance.errors.length > 0) {
        throw Error(JSON.stringify(parserInstance.errors))
    }
    const ast = toAstVisitorInstance.visit(cst)
    return (ast as unknown) as SQLTree
}

const splitPropertyPath = (stringPath: string | number) => {
    const pathArray = String(stringPath).split('.')

    return { propertyName: pathArray[pathArray.length - 1], pathArray }
}

const convertStringTokenToJsString = (str: string) => str.substring(1, str.length - 1)

export { toAst }
