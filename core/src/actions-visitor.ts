import { CstNode, CstParser, ICstVisitor, IToken } from 'chevrotain'
import { ValuesType } from 'utility-types'
import { Integer, lex, Token, tokenVocabulary } from './lexer'
import { labels, SelectParser } from './parser'
import { Field, FieldType, From, Operand, Order, ordering, SQLTree, Value } from './SqlTree'

const parserInstance = new SelectParser()
const BaseSQLVisitor: new (arg?: any) => ICstVisitor<number, any> = parserInstance.getBaseCstVisitorConstructor()
type NodeKeys = Exclude<keyof SelectParser, keyof CstParser> | ValuesType<typeof labels>

type TokenKeys = Token | ValuesType<typeof labels>
type NodeCtx = Record<NodeKeys, CstNode[]>
type TokenCtx = Record<TokenKeys, IToken[]>
type Ctx = NodeCtx & TokenCtx

export class SQLToAstVisitor extends BaseSQLVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    public selectStatement(ctx: NodeCtx) {
        const fields = ctx.selectClause && this.visit(ctx.selectClause)
        const source = ctx.fromClause && this.visit(ctx.fromClause)
        const where = ctx.whereClause && this.visit(ctx.whereClause)
        const order = ctx.orderByClause && this.visit(ctx.orderByClause)
        const limit = ctx.limitClause && this.visit(ctx.limitClause)
        const joins = ctx.joinClause && this.visit(ctx.joinClause)
        const selectStatement = {
            fields,
            source,
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

    public selectClause(ctx: NodeCtx) {
        return this.visit(ctx.projection)
    }

    public value(ctx: TokenCtx) {
        let value = ''
        if (ctx.value?.length) {
            value = ctx.value[0].image
        }
        let type: FieldType = 'fieldIdentifier'
        if (ctx.value && ctx.value[0].tokenType === tokenVocabulary.StringToken) {
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
    public columnClause(ctx: Ctx) {
        if (ctx.function && Array.isArray(ctx.function) && Array.isArray(ctx.value)) {
            const func = ctx.function[0].image
            const parameters = ctx.value.map((x) => this.visit(x))
            const name = ctx.name && ctx.name[0] ? ctx.name[0].image : `${func}(${parameters.map((x) => x.name).join(',')})`
            return buildField(
                name,
                func,
                'fieldFunction',
                parameters.map((x) => buildField(x.name, x.value, x.type)),
            )
        } else {
            const { name, value, type } = this.visit(ctx.value)
            return buildField(name, value, type)
        }
    }

    public projection(ctx: Ctx): Field[] {
        return ctx.columnClause.map((x) => this.visit(x))
    }

    public fromClause(ctx: Ctx, index = 0): From {
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
        const conditions = this.visit(ctx.expressionClause)

        return {
            conditions,
        } as const
    }

    public joinClause(ctx: Ctx) {
        if (!ctx.table) {
            return null
        }

        const joins = new Array<any>()
        ctx.table.forEach((_table, index) => {
            const from = this.fromClause(ctx, index)
            const conditions = this.visit(ctx.expressionClause[index])
            joins.push({
                from,
                conditions,
            })
        })
        return joins
    }

    public limitClause(ctx: Ctx) {
        const limit = parseInt(ctx.Integer[0].image)
        return {
            value: {
                value: limit,
            },
        }
    }
    public orderByClause(ctx: Ctx): Order {
        const { propertyName } = splitPropertyPath(ctx.Identifier[0].image)

        const direction = ctx.OrderByDirection ? (ctx.OrderByDirection[0].image as 'asc' | 'desc') : 'asc'

        const order: ordering = {
            value: {
                type: 'StringValue',
                value: propertyName,
            },
            direction,
        }

        return {
            orderings: [order],
        }
    }

    public expressionClause(ctx: Ctx, i = 0): any {
        if (ctx.subExpression?.length - i === 1) {
            return this.visit(ctx.subExpression[i])
        }
        const left = this.visit(ctx.subExpression[i])

        const operation = ctx.OrAnd[i].image
        const right: Operand = this.expressionClause(ctx, i + 1)

        return {
            type: 'expression',
            left,
            right,
            operation,
        }
    }

    public subExpression(ctx: Ctx) {
        const left = this.visit(ctx.left)
        const operation = this.visit(ctx.relationalOperator)
        const right = this.visit(ctx.right)
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

    public atomicExpression(context: TokenCtx): Operand {
        const entries = Object.entries(context)
        for (const [key, entryValue] of entries) {
            if (key === 'in') {
                const array: Value[] = entryValue.map((value) => {
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
                const field = buildField(entryValue[0].image, entryValue[0].image, 'fieldIdentifier')
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

    public relationalOperator(ctx: TokenCtx) {
        const values = Object.values(ctx)
        const firstItemValue = values[0] && values[0][0]
        if (firstItemValue) {
            const {
                tokenType: { LABEL },
            } = firstItemValue
            return LABEL
        }
        throw new Error()
    }
}

const toAstVisitorInstance = new SQLToAstVisitor()

const toAst = (inputText: string) => {
    const lexResult = lex(inputText)

    parserInstance.input = lexResult.tokens
    const cst: CstNode[] | CstNode = parserInstance.selectStatement()

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

const buildField = (name: string, value: string, type: FieldType, parameters?: Field[]): Field => {
    const { propertyName: namePropertyName } = splitPropertyPath(name)
    const { pathArray: fieldPathArray, propertyName: fieldPropertyName } = splitPropertyPath(value)
    if (type === 'fieldFunction') {
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
            function: {
                name: value,
                parameters: parameters ?? [],
            },
        }
    }

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
