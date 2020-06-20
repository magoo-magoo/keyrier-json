import { CstNode, ICstVisitor, IToken } from 'chevrotain'
import { ReadonlyKeys } from 'utility-types'
import { Integer, lex, Token, tokenVocabulary } from './lexer'
import { SelectParser } from './parser'
import { Field, FieldType, From, Operand, Order, ordering, SQLTree, Value } from './SqlTree'

const parserInstance = new SelectParser()
const BaseSQLVisitor: new (arg?: any) => ICstVisitor<number, any> = parserInstance.getBaseCstVisitorConstructor()

type readonlyKeys = ReadonlyKeys<SelectParser>
type Node = readonlyKeys
export type Ctx = Record<Node, CstNode | CstNode[]>

class SQLToAstVisitor extends BaseSQLVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    public selectStatement(ctx: Ctx) {
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
        } as SQLTree

        return {
            type: 'selectStatement',
            value: selectStatement,
        } as const
    }

    public selectClause(ctx: Ctx) {
        const columns = this.visit(ctx.projection)
        return columns
    }

    public value(ctx: { name: IToken[]; value: IToken[] }): { name: string; value: string; type: FieldType } {
        let value = ''
        if (ctx.value?.length) {
            value = ctx.value[0].image
        }
        let type: FieldType = 'fieldIdentifier'
        if (ctx.value[0].tokenType === tokenVocabulary.StringToken) {
            value = convertStringTokenToJsString(value)
            type = 'fieldString'
        }

        let name = ctx.name && ctx.name[0] ? ctx.name[0].image : value

        if (ctx.name && ctx.name[0].tokenType === tokenVocabulary.StringToken) {
            name = convertStringTokenToJsString(name)
        }

        return {
            name,
            value,
            type,
        }
    }
    public cols(ctx: { name: IToken[]; value: CstNode[]; function: IToken[] }) {
        if (ctx.function) {
            const func = ctx.function[0].image
            let name = ''
            let value = ''
            let type = 'fieldFunction'
            const parameters = ctx.value.map(x => this.visit(x))
            name = ctx.name && ctx.name[0] ? ctx.name[0].image : `${func}(${parameters.map(x => x.name).join(',')})`
            return {
                name,
                value,
                function: func,
                type,
                parameters,
            }
        }
        let { name, value, type } = this.visit(ctx.value)
        return {
            name,
            value,
            type,
        }
    }

    public projection(ctx: { cols: CstNode[] }): Field[] {
        const cols: {
            value: string
            name: string
            function: string | undefined
            type: FieldType
            parameters: { name: string; value: string; type: FieldType }[]
        }[] = ctx.cols.map(x => this.visit(x)) as any
        const fields: Field[] = []

        cols.forEach(({ name, value, function: func, type, parameters }) => {
            const fieldValue = mapField(name, value, type)

            if (func) {
                const field = {
                    ...fieldValue,
                    function: {
                        name: func,
                        parameters: parameters.map(x => mapField(x.name, x.value, x.type)),
                    },
                }
                fields.push(field)
            } else {
                fields.push(fieldValue)
            }
        })
        return fields
    }

    public fromClause(ctx: { table: Array<IToken>; alias: Array<IToken> }, index = 0): From {
        let tableName: string = ctx.table[index].image
        if (ctx.table[index].tokenType === tokenVocabulary.StringToken) {
            tableName = convertStringTokenToJsString(tableName)
        }
        const alias = (ctx.alias && ctx.alias[index].image) ?? tableName
        return {
            type: 'From',
            name: {
                type: 'PathValue',
                value: tableName,
                values: splitPropertyPath(tableName).pathArray,
            },
            alias: {
                type: 'PathValue',
                value: alias,
                values: splitPropertyPath(alias).pathArray,
            },
        }
    }

    public whereClause(ctx: Ctx) {
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
        const { propertyName } = splitPropertyPath(ctx.Identifier[0].image)
        const direction = ctx.OrderByDirection && (ctx.OrderByDirection[0].image as 'asc' | 'desc')

        const order: ordering = {
            value: {
                type: 'StringValue',
                value: propertyName,
                // values: pathArray,
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
            left: {
                type: left.type,
                value: left.value,
                values: splitPropertyPath(left.value).pathArray,
                field: left.field,
            },
            operation,
            right: {
                type: right.type,
                value: right.value,
                values: splitPropertyPath(right.value).pathArray,
                field: right.field,
            },
        }
    }

    public atomicExpression(context: Record<Token | 'in', Array<IToken>>): Operand {
        const entries = Object.entries(context) as [keyof typeof context, Array<IToken>][]
        for (let [key, entryValue] of entries) {
            if (key === 'in') {
                const array: Value[] = entryValue.map(value => {
                    if (value.tokenType === Integer) {
                        const type = 'NumberValue'
                        const intValue = parseInt(value.image)
                        return { type, value: intValue, values: [intValue] }
                    }
                    const type = 'StringValue'
                    const stringValue = convertStringTokenToJsString(value.image)
                    return { type, value: stringValue, values: [stringValue] }
                })
                return { type: 'array', value: array }
            }
            if (key === 'Integer') {
                return { type: 'integer', value: parseInt(entryValue[0].image) }
            }
            if (key === 'Null') {
                return { type: 'null', value: null }
            }
            if (key === 'Identifier') {
                const field = mapField(entryValue[0].image, entryValue[0].image, 'fieldIdentifier')
                return {
                    type: 'opIdentifier',
                    value: entryValue[0].image,
                    field,
                }
            }
            if (key === 'StringToken') {
                return { type: 'string', value: convertStringTokenToJsString(entryValue[0].image) }
            }
        }
        throw new Error()
    }

    public relationalOperator(ctx: Record<Token, Array<IToken>>) {
        const {
            tokenType: { LABEL },
        } = Object.values(ctx)[0][0]

        return LABEL
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

const mapField = (name: string, value: string, type: FieldType): Field => {
    const { propertyName: namePropertyName } = splitPropertyPath(name)
    const { pathArray: fieldPathArray, propertyName: fieldPropertyName } = splitPropertyPath(value)

    return {
        type,
        name: {
            type: 'StringValue',
            value: namePropertyName,
        },
        field: {
            type: 'PathValue',
            value: fieldPropertyName,
            values: fieldPathArray,
        },
    }
}

export { toAst }
