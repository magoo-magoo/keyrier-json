import { orderBy } from 'lodash'
import { jsonParseSafe } from '../converters/json'
import { toAst } from './actions-visitor'
import { Field, From, Operand, SQLTree } from './SqlTree'

const allowedSourceNames = ['data', 'json', 'csv', 'stdin'] as const

export const computePath = (path: string[] | undefined) => {
    if (!path) {
        return []
    }
    if (allowedSourceNames.some(x => x === path[0]?.toLowerCase())) {
        return [...path].slice(1)
    }

    return path
}

export const sqlQuery = (json: string, query: string) => {
    try {
        const sqlTree = toAst(query)

        if (!allowedSourceNames.some(x => x === String(sqlTree.source.name.values[0]).toLowerCase())) {
            return new SyntaxError(String(sqlTree.source.name.values[0]))
        }

        const sourceDataObject = jsonParseSafe(json)

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

const get = (obj: any, path: (string | number)[], defaultValue: any = undefined) => {
    const travel = (regexp: any) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
    return result === undefined || result === obj ? defaultValue : result
}

const slice = (array: any[], start: number, end: number) => {
    let length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    start = start == null ? 0 : start
    end = end === undefined ? length : end

    if (start < 0) {
        start = -start > length ? 0 : length + start
    }
    end = end > length ? length : end
    if (end < 0) {
        end += length
    }
    length = start > end ? 0 : (end - start) >>> 0
    start >>>= 0

    let index = -1
    const result = new Array(length)
    while (++index < length) {
        result[index] = array[index + start]
    }
    return result
}
const take = (array: any[], n = 1) => {
    if (!(array != null && array.length)) {
        return []
    }

    return slice(array, 0, n < 0 ? 0 : n)
}

export const executeQuery = (sqlTree: SQLTree, sourceDataObject: object) => {
    const fromPath = [...sqlTree.source.name.values]
    fromPath.shift()

    let data = sourceDataObject

    if (fromPath.length > 0) {
        data = get(data, fromPath.slice(0))
    }

    if (!Array.isArray(data)) {
        return mapper(data, sqlTree.fields, sqlTree.source)
    }

    const filtered = data.filter(v => {
        if (!sqlTree.where || !sqlTree.where.conditions) {
            return true
        }
        const leftValue = sqlTree.where.conditions.left
        const rightValue = sqlTree.where.conditions.right
        const operation = sqlTree.where.conditions.operation

        return compareOperands(operation, leftValue, rightValue, v)
    })

    const ordered = orderBy(
        filtered,
        sqlTree.order ? sqlTree.order.orderings.map(x => x.value.value) : [],
        sqlTree.order ? sqlTree.order.orderings.map(x => x.direction) : []
    )
    const limited = take(
        ordered,
        sqlTree.limit?.value?.value ? parseInt(sqlTree.limit.value.value.toString()) : 999999999999999
    )
    const mapped = limited.map(v => mapper(v, sqlTree.fields, sqlTree.source))

    return mapped
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
    const mappedObject: {
        [key: string]: any
    } = {}
    fields.forEach(field => {
        const value = get(
            mapped,
            field.field.values.filter(val => val !== source.alias?.value)
        )
        mappedObject[field.name.value] = field.function ? applyFunc(field.function.name, value) : value
    })
    return mappedObject
}

const applyFunc = (funcName: string, value: any) => {
    const func = funcName.toLowerCase()
    if (func === 'lower') {
        return String(value).toLowerCase()
    }
    if (func === 'upper') {
        return String(value).toUpperCase()
    }
    if (func === 'trim') {
        return String(value).trim()
    }
    if (func === 'reverse') {
        return String(value).split('').reverse().join('')
    }
    if (func === 'length' || func === 'len') {
        return String(value).length
    }
    return value
}
