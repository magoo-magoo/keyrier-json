import * as _ from 'lodash'
import { jsonParseSafe } from './converters/json'
import { toAst } from './sql/actions-visitor'
import { Field, From, Operand, SQLTree } from './sql/SqlTree'
export const computePath = (path: string[] | undefined) => {
    if (!path) {
        return []
    }
    if (path[0] === 'data') {
        const newPath = [...path]
        newPath.shift()
        return newPath
    }

    return path
}

export const sqlEvaluation = (sourceString: string, queryString: string) => {
    try {
        const sqlTree = toAst(cleanComment(queryString))
        if (sqlTree.source.name.values && sqlTree.source.name.values[0] !== 'data') {
            return new SyntaxError(String(sqlTree.source.name.values[0]))
        }

        const sourceDataObject = jsonParseSafe(sourceString)

        const result = executeQuery(sqlTree, sourceDataObject)

        return JSON.stringify(result)
    } catch (e) {
        return e as Error
    }
}

const cleanComment = (str: string) => str.replace(/--(.*?)(\n|$)/gm, '')

const map = (v: object, fields: Field[], source: From) => {
    if (fields.some(x => x.field.value === '*')) {
        return v
    }

    return mapObject(fields, v, source)
}

const executeQuery = (sqlTree: SQLTree, sourceDataObject: object) => {
    let fromPath: (string | number)[] = [...sqlTree.source.name.values]
    fromPath.shift()

    let result = _.chain<any>(sourceDataObject)

    if (fromPath && fromPath.length > 0) {
        result = _.chain<any>(result.get(fromPath))
    }
    const value = result.value()
    if (_.isArray(value)) {
        return result
            .filter(v => {
                if (!sqlTree.where || !sqlTree.where.conditions) {
                    return true
                }
                const leftValue = sqlTree.where.conditions.left
                const rightValue = sqlTree.where.conditions.right
                const operation = sqlTree.where.conditions.operation

                return compareOperands(operation, leftValue, rightValue, v)
            })
            .orderBy(
                sqlTree.order ? sqlTree.order.orderings.map(x => x.value.value) : undefined,
                sqlTree.order ? sqlTree.order.orderings.map(x => x.direction) : undefined
            )
            .map(v => map(v, sqlTree.fields, sqlTree.source))
            .take(sqlTree.limit?.value?.value ? parseInt(sqlTree.limit.value.value.toString()) : 999999999999999)
            .value()
    }
    return map(value, sqlTree.fields, sqlTree.source)
}
const operators = {
    modulo: '%',
} as const
const compareOperands = (operation: string, left: Operand, right: Operand, value: object): boolean => {
    const leftValue = _.get(value, computePath(left?.values))

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
        const value = _.get(
            mapped,
            field.field.values.filter(val => val !== source.alias?.value)
        )
        temp[field.name.value] = value
    })
    mapped = temp
    return mapped
}
