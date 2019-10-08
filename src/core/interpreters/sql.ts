import _ from 'lodash'
import { parse, nodes, Op, Field, SQLTree, Source } from 'sql-parser'
import { jsonParseSafe } from '../converters/json'

export const computePath = (path: string[]) => {
    if (!path || path.length === 0) {
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
        const sqlTree = parse(queryString.replace(/--(.*?)(\n|$)/gm, ''))
        console.log({ sqlTree })
        if (sqlTree.source.name.values[0] !== 'data') {
            return new Error(`${sqlTree.source.name.values[0]} table does not exist`)
        }

        const sourceDataObject = jsonParseSafe(sourceString)

        const result = executeQuery(sqlTree, sourceDataObject)

        return JSON.stringify(result)
    } catch (e) {
        return e as Error
    }
}

const map = (v: object, fields: Field[], source: Source) => {
    if (fields[0].constructor === nodes.Star) {
        return v
    }

    if (Array.isArray(v)) {
        return v.map(x => mapObject(fields, x, source))
    }

    return mapObject(fields, v, source)
}

const executeQuery = (sqlTree: SQLTree, sourceDataObject: object) => {
    let fromPath: string[] = []

    if (sqlTree.source.name.values && sqlTree.source.name.values.length > 1) {
        if (sqlTree.source.name.values[0] === 'data') {
            fromPath = [...sqlTree.source.name.values]
            fromPath.shift()
        }
    }

    let result = _.chain(sourceDataObject)

    if (fromPath && fromPath.length > 0) {
        result = result.get(fromPath)
    }
    sourceDataObject = result.value()
    if (_.isArray(sourceDataObject)) {
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
            .take(
                sqlTree.limit && typeof sqlTree.limit.value.value === 'number'
                    ? sqlTree.limit.value.value
                    : 999999999999999
            )
            .value()
    } else {
        return map(sourceDataObject, sqlTree.fields, sqlTree.source)
    }
}

const compareOperands = (operation: string | null, left: Op, right: Op, value: object): boolean => {
    if (!operation) {
        return false
    }

    if (operation.toLowerCase() === 'or') {
        return (
            compareOperands(left.operation, left.left, left.right, value) ||
            compareOperands(right.operation, right.left, right.right, value)
        )
    }

    if (operation.toLowerCase() === 'and') {
        return (
            compareOperands(left.operation, left.left, left.right, value) &&
            compareOperands(right.operation, right.left, right.right, value)
        )
    }

    if (!left.value) {
        return false
    }

    const leftValue = _.get(value, computePath(left.values))

    if (operation === '=' && leftValue === right.value) {
        return true
    }
    if (operation.toLowerCase() === 'is' && leftValue === right.value) {
        return true
    }
    if (operation === '!=' && leftValue !== right.value) {
        return true
    }
    if (operation.toLowerCase() === 'is not' && leftValue !== right.value) {
        return true
    }
    if (operation === '<>' && leftValue !== right.value) {
        return true
    }

    if (operation.toLocaleLowerCase() === 'like' && typeof right.value === 'string' && typeof leftValue === 'string') {
        if (right.value.startsWith('%') && right.value.endsWith('%')) {
            if (leftValue.includes(right.value.substring(1, right.value.length - 1))) {
                return true
            }
        } else if (right.value.startsWith('%')) {
            if (leftValue.endsWith(right.value.substring(right.value.indexOf('%') + 1))) {
                return true
            }
        } else if (right.value.endsWith('%')) {
            if (leftValue.startsWith(right.value.substring(0, right.value.indexOf('%')))) {
                return true
            }
        }
    }

    if (right.value) {
        if (operation === '>' && leftValue > right.value) {
            return true
        }
        if (operation === '>=' && leftValue >= right.value) {
            return true
        }
        if (operation === '<' && leftValue < right.value) {
            return true
        }
        if (operation === '<=' && leftValue <= right.value) {
            return true
        }
    }

    if (
        operation.toLowerCase() === 'in' &&
        Array.isArray(right.value) &&
        right.value.filter(x => x.value === leftValue).length > 0
    ) {
        return true
    }

    return false
}

const mapObject = (fields: Field[], mapped: object, source: Source) => {
    const temp: {
        [key: string]: any
    } = {}
    fields.forEach(field => {
        const value = _.get(
            mapped,
            field.field.values.filter((val, index) => !(index === 0 && source.alias && val === source.alias.value))
        )
        let key = field.field.value
        if (field.field.value2) {
            key = field.field.value2
        }
        if (field.name) {
            key = field.name.value
        }
        temp[key] = value
    })
    mapped = temp
    return mapped
}
