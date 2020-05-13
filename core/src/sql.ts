import { filter, flow, get, map, orderBy, take } from 'lodash'
import { jsonParseSafe } from './converters/json'
import { toAst } from './sql/actions-visitor'
import { Field, From, Operand, SQLTree } from './sql/SqlTree'

const allowedSourceNames = ['data', 'json'] as const

export const computePath = (path: string[] | undefined) => {
    if (!path) {
        return []
    }
    if (allowedSourceNames.some(x => x === path[0]?.toLowerCase())) {
        return [...path].slice(1)
    }

    return path
}

export const sqlQuery = (sourceString: string, queryString: string) => {
    try {
        const sqlTree = toAst(queryString)

        if (!allowedSourceNames.some(x => x === String(sqlTree.source.name.values[0]).toLowerCase())) {
            return new SyntaxError(String(sqlTree.source.name.values[0]))
        }

        const sourceDataObject = jsonParseSafe(sourceString)

        return executeQuery(sqlTree, sourceDataObject)
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

const executeQuery = (sqlTree: SQLTree, sourceDataObject: object) => {
    const fromPath = [...sqlTree.source.name.values]
    fromPath.shift()

    let data = sourceDataObject

    if (fromPath.length > 0) {
        data = get(data, fromPath.slice(0))
    }

    if (!Array.isArray(data)) {
        return mapper(data, sqlTree.fields, sqlTree.source)
    }

    const lodashFlow = flow(
        items =>
            filter(items, v => {
                if (!sqlTree.where || !sqlTree.where.conditions) {
                    return true
                }
                const leftValue = sqlTree.where.conditions.left
                const rightValue = sqlTree.where.conditions.right
                const operation = sqlTree.where.conditions.operation

                return compareOperands(operation, leftValue, rightValue, v)
            }),
        filtered =>
            orderBy(
                filtered,
                sqlTree.order ? sqlTree.order.orderings.map(x => x.value.value) : [],
                sqlTree.order ? sqlTree.order.orderings.map(x => x.direction) : []
            ),
        ordered =>
            take(
                ordered,
                sqlTree.limit?.value?.value ? parseInt(sqlTree.limit.value.value.toString()) : 999999999999999
            ),
        limited => map(limited, v => mapper(v, sqlTree.fields, sqlTree.source))
    )

    return lodashFlow(data)
}

const operators = {
    modulo: '%',
} as const
const compareOperands = (operation: string, left: Operand, right: Operand, value: object): boolean => {
    const leftValue = get(value, computePath(left?.values))

    switch (operation.toLowerCase()) {
        case 'or':
            return (
                compareOperands(left.operation, left.left, left.right, value) ||
                compareOperands(right.operation, right.left, right.right, value)
            )
        case 'and':
            return (
                compareOperands(left.operation, left.left, left.right, value) &&
                compareOperands(right.operation, right.left, right.right, value)
            )

        case '=':
        case 'is':
            return leftValue === right.value
        case '!=':
        case 'is not':
        case '<>':
            return leftValue !== right.value
        case 'like': {
            const leftStr = String(leftValue)
            const rightStr = String(right.value)
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
            const rightStr = String(right.value)
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
            return !!right.value && leftValue > right.value
        case '>=':
            return !!right.value && leftValue >= right.value
        case '<':
            return !!right.value && leftValue < right.value
        case '<=':
            return !!right.value && leftValue <= right.value
        case 'in':
            return Array.isArray(right.value) && right.value.filter(x => x.value === leftValue).length > 0
    }
    return false
}

const mapObject = (fields: Field[], mapped: object, source: From) => {
    const temp: {
        [key: string]: any
    } = {}
    fields.forEach(field => {
        const value = get(
            mapped,
            field.field.values.filter(val => val !== source.alias?.value)
        )
        temp[field.name.value] = value
    })
    return temp
}
