import { CstNode, ICstVisitor, IToken } from 'chevrotain'
import { Integer, lex, Token, tokenVocabulary } from './lexer'
import { SelectParser } from './parser'
import { Field, From, Operand, Order, ordering, SQLTree } from './SqlTree'

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
        joinClause: CstNode | CstNode[]
    }) {
        const select = this.visit(ctx.selectClause)
        const from = this.visit(ctx.fromClause)
        const where = this.visit(ctx.whereClause)
        const order = this.visit(ctx.orderByClause)
        const limit = this.visit(ctx.limitClause)
        const joins = this.visit(ctx.joinClause)
        const selectStatement = {
            fields: select,
            source: from,
            where,
            order,
            limit,
            joins,
        }

        return {
            type: 'selectStatement',
            value: selectStatement,
        } as const
    }

    public selectClause(ctx: { projection: CstNode | CstNode[] }) {
        const columns = this.visit(ctx.projection)
        return columns
    }

    public cols(ctx: { name: IToken[]; value: IToken[]; function: IToken[] }) {
        let value = ctx.value[0].image

        if (ctx.value[0].tokenType === tokenVocabulary.StringToken) {
            value = convertStringTokenToJsString(value)
        }

        let name = ctx.name && ctx.name[0] ? ctx.name[0].image : value

        const func = ctx.function && ctx.function[0] && ctx.function[0].image
        if (func) {
            name = ctx.name && ctx.name[0] ? ctx.name[0].image : `${func}(${value})`
        }
        if (ctx.name && ctx.name[0].tokenType === tokenVocabulary.StringToken) {
            name = convertStringTokenToJsString(name)
        }

        return {
            name,
            value,
            function: func,
        }
    }

    public projection(ctx: { cols: CstNode[] }) {
        const cols: { value: string; name: string; function: string | undefined }[] = ctx.cols.map(x =>
            this.visit(x)
        ) as any
        const fields: Field[] = []
        cols.forEach(({ name, value, function: func }) => {
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
                function: func ? { name: func } : undefined,
            }
            fields.push(field)
        })
        return fields
    }

    public fromClause(ctx: { table: Array<IToken>; alias: Array<IToken> }, index = 0): From {
        let tableName: string = ctx.table[index].image
        if (ctx.table[index].tokenType === tokenVocabulary.StringToken) {
            tableName = convertStringTokenToJsString(tableName)
        }
        const alias = ctx.alias?.length >= index + 1 ? ctx.alias[0].image : tableName
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

    public joinClause(ctx: { table: Array<IToken>; alias: Array<IToken>; expression: CstNode[] }) {
        if (!ctx.table) {
            return null
        }

        const joins: any[] = []
        ctx.table.forEach((_table, index) => {
            const from = this.fromClause(ctx, index)
            const conditions = this.visit(ctx.expression[index])
            joins.push({
                from,
                conditions,
            })
        })
        return joins
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

        const order: ordering = {
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
    ): any {
        if (ctx.subExpression?.length - i === 1) {
            return this.visit(ctx.subExpression[i])
        }
        const left = this.visit(ctx.subExpression[i])

        const operation = ctx.OrAnd[i].image
        const right: Operand = this.expression(ctx, i + 1)

        return {
            type: 'expression',
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
            type: 'expression',
            left: { type: left.type, value: left.value, values: splitPropertyPath(left.value).pathArray },
            operation,
            right: { type: right.type, value: right.value, values: splitPropertyPath(right.value).pathArray },
        }
    }

    public atomicExpression(context: Record<Token | 'in', Array<IToken>>) {
        const entries = Object.entries(context) as [keyof typeof context, Array<IToken>][]
        for (let [key, value] of entries) {
            if (key === 'in') {
                const array = value
                    .map(x => {
                        if (x.tokenType === Integer) {
                            return parseInt(x.image)
                        }
                        return convertStringTokenToJsString(x.image)
                    })
                    .map(v => ({ value: v }))
                return { type: 'array', value: array }
            }
            if (key === 'Integer') {
                return { type: 'integer', value: parseInt(value[0].image) }
            }
            if (key === 'Null') {
                return { type: 'null', value: null }
            }
            if (key === 'Identifier') {
                return { type: 'identifier', value: value[0].image }
            }
            if (key === 'StringToken') {
                return { type: 'string', value: convertStringTokenToJsString(value[0].image) }
            }
        }
        return null
    }

    public relationalOperator(ctx: Record<Token, Array<IToken>>) {
        const values = Object.values(ctx)
        return values[0][0].image
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
    return (ast.value as unknown) as SQLTree
}

const splitPropertyPath = (stringPath: string | number) => {
    const pathArray = String(stringPath).split('.')

    return { propertyName: pathArray[pathArray.length - 1], pathArray }
}

const convertStringTokenToJsString = (str: string) => str.substring(1, str.length - 1)

export { toAst }
