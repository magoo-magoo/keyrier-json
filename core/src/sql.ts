import { orderBy } from 'lodash'
import { toAst } from './actions-visitor'
import { Conditions, Field, From, Operand, Operation, operators, SQLTree } from './SqlTree'
import * as utils from './utils'

export const computePath = (path: (string | number)[] | undefined, allowedSourceNames: string[]) => {
    if (!path) {
        return { path: [] }
    }
    if (allowedSourceNames.some(x => x === String(path[0])?.toLowerCase())) {
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

        if (
            !Object.keys(source).some(
                x =>
                    x.toLowerCase() === String(sqlTree.source.alias.values[0]).toLowerCase() ||
                    x.toLowerCase() === String(sqlTree.source.name.value)
            )
        ) {
            return new SyntaxError(String(sqlTree.source.name.values[0]))
        }

        const sourceDataObjects: Record<string, object> = {}
        Object.keys(source).forEach(key => {
            sourceDataObjects[key] = utils.jsonParseSafe(source[key])
        })

        return executeQuery(sqlTree, sourceDataObjects)
    } catch (e) {
        return e as Error
    }
}

const getSourceData = (sqlTree: SQLTree, sourceDataObject: Record<string, object>) => {
    if (sourceDataObject[sqlTree.source.name.value]) {
        return sourceDataObject[sqlTree.source.name.value]
    }

    const fromPath = [...sqlTree.source.name.values]
    fromPath.shift()
    let data = sourceDataObject[sqlTree.source.name.values[0]]

    if (fromPath.length > 0) {
        data = utils.get(data, fromPath.slice(0))
    }

    return data
}

export type Row = {
    projected: object
    real: object
    dataContext: Record<string, object>
    includeInResult: boolean
}

export const executeQuery = (sqlTree: SQLTree, sourceDataObject: Record<string, any>) => {
    const fromPath = [...sqlTree.source.name.values]
    fromPath.shift()
    const data = getSourceData(sqlTree, sourceDataObject)

    if (!Array.isArray(data)) {
        return mapper(data, sqlTree.fields, { [sqlTree.source.alias.value]: data })
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
    const rows: Row[] = data.map(x => ({
        real: x,
        projected: x,
        includeInResult: true,
        dataContext: {
            [sqlTree.source.name.value]: x,
            [sqlTree.source.alias.value]: x,
        },
    }))

    const ordered = sqlTree.order
        ? orderBy(
              rows,
              sqlTree.order.orderings.map(x => 'real.' + x.value.value),
              sqlTree.order.orderings.map(x => x.direction)
          )
        : rows

    const results: object[] = []
    ordered.forEach(row => {
        if (sqlTree.limit && sqlTree.limit.value.value <= results.length) {
            return
        }
        const shouldBeIncludeInResults = () => {
            if (jointures.length) {
                for (const { source, conditions, from } of jointures) {
                    let match = false
                    for (const joinRow of source) {
                        const joinRowData = {
                            [from.name.value]: joinRow,
                            [from.alias.value]: joinRow,
                        }
                        row.dataContext = { ...row.dataContext, ...joinRowData }
                        const comparison = compareOperands(
                            conditions.operation,
                            conditions.left,
                            conditions.right,
                            {
                                ...joinRowData,
                                ...row.dataContext,
                            },
                            sourceDataObject
                        )
                        if (comparison) {
                            match = true
                        }
                    }
                    if (!match) {
                        row.includeInResult = false
                    }
                }
            }

            if (!sqlTree.where || !sqlTree.where.conditions) {
                row.includeInResult = row.includeInResult && true
                return
            }
            const leftValue = sqlTree.where.conditions.left
            const rightValue = sqlTree.where.conditions.right
            const operation = sqlTree.where.conditions.operation

            const comparison = compareOperands(operation, leftValue, rightValue, row.dataContext, sourceDataObject)

            row.includeInResult = row.includeInResult && comparison
        }

        shouldBeIncludeInResults()

        if (row.includeInResult) {
            const mapped = mapper(row.real, sqlTree.fields, row.dataContext)
            row.projected = mapped
            results.push(mapped)
        }
    })

    return results
}

const compareOperands = (
    operation: Operation,
    left: Operand,
    right: Operand,
    values: Record<string, object>,
    sourceDataObject: Record<string, object>
): boolean => {
    const leftValue = getValue(left, values)
    const rightValue = getValue(right, values)
    switch (operation.toLowerCase()) {
        case operators.or:
            return (
                (left.type === 'expression' &&
                    compareOperands(left.operation, left.left, left.right, values, sourceDataObject)) ||
                (right.type === 'expression' &&
                    compareOperands(right.operation, right.left, right.right, values, sourceDataObject))
            )
        case operators.and:
            return (
                left.type === 'expression' &&
                compareOperands(left.operation, left.left, left.right, values, sourceDataObject) &&
                right.type === 'expression' &&
                compareOperands(right.operation, right.left, right.right, values, sourceDataObject)
            )
    }
    switch (operation.toLowerCase()) {
        case operators.equal:
        case operators.is:
            return leftValue === rightValue
        case operators.notEqual:
        case operators.isNot:
            return leftValue !== rightValue
        case operators.like: {
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
        case operators.notLike: {
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
        case operators.greaterThan:
            return !!rightValue && !!leftValue && leftValue > rightValue
        case operators.greaterOrEqualThan:
            return !!rightValue && !!leftValue && leftValue >= rightValue
        case operators.lessThan:
            return !!rightValue && !!leftValue && leftValue < rightValue
        case operators.lessOrEqualthan:
            return !!rightValue && !!leftValue && leftValue <= rightValue
        case operators.in: {
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

const mapObject = (fields: Field[], sources: Record<string, object>) => {
    const mappedObject: Record<string, object> = {}
    fields.forEach(field => {
        const value = getValue(field, sources)
        mappedObject[field.name.value] = field.function ? applyFunction(field.function.name, value) : value
    })
    return mappedObject
}

const applyFunction = (functionName: string, value: object) => {
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

const getValue = (operand: Operand | Field, values: Record<string, object>) => {
    if (
        operand.type === 'integer' ||
        operand.type === 'string' ||
        operand.type === 'array' ||
        operand.type === 'selectStatement' ||
        operand.type === 'null' ||
        operand.type === 'expression'
    ) {
        return operand.value
    }
    if (operand.type === 'opIdentifier') {
        const { field } = operand
        return getIdentifierValue(values, field)
    }
    return getIdentifierValue(values, operand)
}

const mapper = (v: object, fields: Field[], sources: Record<string, object>) => {
    if (fields.some(x => x.field.value === '*')) {
        return v
    }

    return mapObject(fields, sources)
}

function getIdentifierValue(values: Record<string, object>, field: Field) {
    const availableTables = Object.keys(values)
    const { path, tableName } = computePath(field?.field.values, availableTables)

    if (tableName && !availableTables.some(x => x === tableName)) {
        throw Error(`Unknown identifier: ${tableName}`)
    }
    if (!tableName && availableTables.length > 1) {
        throw Error(`Ambiguous identifier: ${field.field.value}`)
    }

    const value = tableName ? values[tableName] : Object.values(values)[0]
    return utils.get(value, path)
}
