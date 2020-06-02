import { orderBy } from 'lodash'
import * as utils from './utils'
import { toAst } from './actions-visitor'
import { Conditions, Field, From, Operand, SQLTree } from './SqlTree'

export const computePath = (path: string[] | undefined, allowedSourceNames: string[]) => {
    if (!path) {
        return { path: [] }
    }
    if (allowedSourceNames.some(x => x === path[0]?.toLowerCase())) {
        return { tableName: path[0], path: [...path].slice(1) }
    }

    return { path }
}

export const sqlQuery = (json: string, query: string) => {
    return sqlQueryWithMultipleSources({ data: json, json }, query)
}

export const sqlQueryWithMultipleSources = (source: Record<string, string>, query: string) => {
    try {
        const sqlTree = toAst(query)

        if (!Object.keys(source).some(x => x === String(sqlTree.source.name.values[0]).toLowerCase())) {
            return new SyntaxError(String(sqlTree.source.name.values[0]))
        }

        const sourceDataObjects: Record<string, any> = {}
        Object.keys(source).forEach(key => {
            sourceDataObjects[key] = utils.jsonParseSafe(source[key])
        })

        return executeQuery(sqlTree, sourceDataObjects)
    } catch (e) {
        return e as Error
    }
}

const mapper = (v: object, fields: Field[], source: From) => {
    if (fields.some(x => x.field.value === '*')) {
        return v
    }

    return mapObject(fields, v, source)
}

export const executeQuery = (sqlTree: SQLTree, sourceDataObject: Record<string, any>) => {
    const fromPath = [...sqlTree.source.name.values]
    fromPath.shift()
    let data = sourceDataObject[sqlTree.source.name.values[0]]

    if (fromPath.length > 0) {
        data = utils.get(data, fromPath.slice(0))
    }

    if (!Array.isArray(data)) {
        return mapper(data, sqlTree.fields, sqlTree.source)
    }

    let jointures: { source: any[]; conditions: Conditions; from: From }[] = []
    if (sqlTree.joins) {
        sqlTree.joins.forEach(join => {
            jointures.push({
                from: join.from,
                conditions: join.conditions,
                source: sourceDataObject[join.from.name.value],
            })
        })
    }
    const filtered = data.filter(v => {
        if (jointures.length) {
            for (const { source, conditions, from } of jointures) {
                let match = false
                for (const joinRow of source) {
                    const comparison = compareOperands(
                        conditions.operation,
                        conditions.left,
                        conditions.right,
                        {
                            [from.name.value]: joinRow,
                            [from.alias.value]: joinRow,
                            [sqlTree.source.name.value]: v,
                            [sqlTree.source.alias.value]: v,
                        },
                        sourceDataObject
                    )
                    if (comparison) {
                        match = true
                    }
                }
                if (!match) {
                    return false
                }
            }
        }

        if (!sqlTree.where || !sqlTree.where.conditions) {
            return true
        }
        const leftValue = sqlTree.where.conditions.left
        const rightValue = sqlTree.where.conditions.right
        const operation = sqlTree.where.conditions.operation

        const comparison = compareOperands(
            operation,
            leftValue,
            rightValue,
            {
                [sqlTree.source.alias.value]: v,
                [sqlTree.source.name.value]: v,
            },
            sourceDataObject
        )

        return comparison
    })

    const ordered = orderBy(
        filtered,
        sqlTree.order ? sqlTree.order.orderings.map(x => x.value.value) : [],
        sqlTree.order ? sqlTree.order.orderings.map(x => x.direction) : []
    )
    const limited = utils.take(
        ordered,
        sqlTree.limit?.value?.value ? parseInt(sqlTree.limit.value.value.toString()) : 999999999999999
    )
    const mapped = limited.map(v => mapper(v, sqlTree.fields, sqlTree.source))

    return mapped
}

const operators = {
    modulo: '%',
} as const
const compareOperands = (
    operation: string,
    left: Operand,
    right: Operand,
    values: Record<string, any>,
    sourceDataObject: Record<string, any>
): boolean => {
    const leftValue = getValue(left, values)
    const rightValue = getValue(right, values)
    switch (operation.toLowerCase()) {
        case 'or':
            return (
                (left.type === 'expression' &&
                    compareOperands(left.operation, left.left, left.right, values, sourceDataObject)) ||
                (right.type === 'expression' &&
                    compareOperands(right.operation, right.left, right.right, values, sourceDataObject))
            )
        case 'and':
            return (
                left.type === 'expression' &&
                compareOperands(left.operation, left.left, left.right, values, sourceDataObject) &&
                right.type === 'expression' &&
                compareOperands(right.operation, right.left, right.right, values, sourceDataObject)
            )
    }
    switch (operation.toLowerCase()) {
        case '=':
        case 'is':
            return leftValue === rightValue
        case '!=':
        case 'is not':
        case '<>':
            return leftValue !== rightValue
        case 'like': {
            const leftStr = String(leftValue)
            const rightStr = String(rightValue)
            if (rightStr.startsWith(operators.modulo) && rightStr.endsWith(operators.modulo)) {
                if (leftStr.includes(rightStr.substring(1, rightStr.length - 1))) {
                    return true
                }
            } else if (rightStr.startsWith(operators.modulo)) {
                if (leftStr.endsWith(rightStr.substring(rightStr.indexOf(operators.modulo) + 1))) {
                    return true
                }
            } else if (rightStr.endsWith(operators.modulo)) {
                if (leftStr.startsWith(rightStr.substring(0, rightStr.indexOf(operators.modulo)))) {
                    return true
                }
            }
            return false
        }
        case 'not like': {
            const leftStr = String(leftValue)
            const rightStr = String(rightValue)
            if (rightStr.startsWith(operators.modulo) && rightStr.endsWith(operators.modulo)) {
                if (leftStr.includes(rightStr.substring(1, rightStr.length - 1))) {
                    return false
                }
            } else if (rightStr.startsWith(operators.modulo)) {
                if (leftStr.endsWith(rightStr.substring(rightStr.indexOf(operators.modulo) + 1))) {
                    return false
                }
            } else if (rightStr.endsWith(operators.modulo)) {
                if (leftStr.startsWith(rightStr.substring(0, rightStr.indexOf(operators.modulo)))) {
                    return false
                }
            }
            return true
        }
        case '>':
            return !!rightValue && !!leftValue && leftValue > rightValue
        case '>=':
            return !!rightValue && !!leftValue && leftValue >= rightValue
        case '<':
            return !!rightValue && !!leftValue && leftValue < rightValue
        case '<=':
            return !!rightValue && !!leftValue && leftValue <= rightValue
        case 'in': {
            if (!rightValue) {
                break
            }
            if (Array.isArray(rightValue)) {
                return rightValue.filter(x => x.value === leftValue).length > 0
            }
            if (right.type === 'selectStatement') {
                const rightval = executeQuery(right.value, sourceDataObject)
                if (Array.isArray(rightval)) {
                    const array = rightval
                    return array.filter(x => x[right.value.fields[0].field.value] === leftValue).length > 0
                }
            }
        }
    }
    return false
}

const mapObject = (fields: Field[], mapped: object, source: From) => {
    const mappedObject: {
        [key: string]: any
    } = {}
    fields.forEach(field => {
        const value = utils.get(
            mapped,
            field.field.values.filter(val => val !== source.alias?.value)
        )
        mappedObject[field.name.value] = field.function ? applyFunction(field.function.name, value) : value
    })
    return mappedObject
}

const applyFunction = (functionName: string, value: any) => {
    const func = functionName.toLowerCase()
    if (func === 'lower') {
        return String(value).toLowerCase()
    }
    if (func === 'upper') {
        return String(value).toUpperCase()
    }
    if (func === 'trim') {
        return String(value).trim()
    }
    if (func === 'trimleft') {
        return String(value).trimLeft()
    }
    if (func === 'trimright') {
        return String(value).trimRight()
    }
    if (func === 'reverse') {
        return String(value).split('').reverse().join('')
    }
    if (func === 'length' || func === 'len') {
        return String(value).length
    }
    return value
}
const getValue = (operand: Operand, values: Record<string, any>) => {
    let operandValue = operand.value
    if (operand.type === 'identifier') {
        const availableTables = Object.keys(values)
        const { path, tableName } = computePath(operand?.values, availableTables)

        if (tableName && !availableTables.some(x => x === tableName)) {
            throw Error(`Unknown identifier: ${tableName}`)
        }
        if (!tableName && availableTables.length > 1) {
            throw Error(`Ambiguous identifier: ${operandValue}`)
        }

        const value = tableName ? values[tableName] : Object.values(values)[0]
        operandValue = utils.get(value, path)
    }
    return operandValue
}
