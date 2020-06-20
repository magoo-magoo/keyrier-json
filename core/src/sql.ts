import { orderBy } from 'lodash'
import { toAst } from './actions-visitor'
import { operators } from './operators'
import { Conditions, Field, From, Func, Operand, Operation, SQLTree, Where } from './SqlTree'
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

/**
 *
 * @param json JSON source.
 * @param query SQL query
 */
export const sqlQuery = (json: string, query: string) => {
    return sqlQueryWithMultipleSources({ data: json, json }, query)
}

/**
 * Function
 * @return {object | object[]}
 */
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

    return utils.get(sourceDataObject[sqlTree.source.name.values[0]], fromPath)
}

export type Row = {
    projected: object
    real: object
    dataContext: Record<string, object>
}
type Jointure = {
    source: any[]
    conditions: Conditions
    from: From
}

export const executeQuery = (sqlTree: SQLTree, sourceDataObject: Record<string, any>): any => {
    const data = getSourceData(sqlTree, sourceDataObject)

    if (!Array.isArray(data)) {
        return mapper(data, sqlTree.fields, { [sqlTree.source.alias.value]: data }, sourceDataObject)
    }

    let jointures: Jointure[] = []
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
        const shouldBeIncludeInResults = rowShouldBeincludedInResult(jointures, row, sourceDataObject, sqlTree.where)

        if (shouldBeIncludeInResults) {
            const mapped = mapper(row.real, sqlTree.fields, row.dataContext, sourceDataObject)
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
): any => {
    const leftValue = getValue(left, values, sourceDataObject)
    const rightValue = getValue(right, values, sourceDataObject)
    switch (operation) {
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
    switch (operation) {
        case '=':
        case 'is':
            return leftValue === rightValue
        case '!=':
        case 'is not':
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
        case 'in':
            return rightValue.filter((x: any) => x.value === leftValue).length > 0
    }
}

const mapObject = (fields: Field[], sources: Record<string, object>, sourceDataObject: Record<string, object>) => {
    const mappedObject: Record<string | number, any> = {}
    fields.forEach(field => {
        const value = getValue(field, sources, sourceDataObject)
        if (field.type === 'fieldFunction') {
            mappedObject[field.name.value] = applyFunction(field.function, sources, sourceDataObject)
        } else {
            mappedObject[field.name.value] = value
        }
    })
    return mappedObject
}

const functions: Record<string, ((value: any) => string | number) | undefined> = {
    lower: parameters => String(parameters[0]).toLowerCase(),
    upper: parameters => String(parameters[0]).toUpperCase(),
    trim: parameters => String(parameters[0]).trim(),
    trimleft: parameters => String(parameters[0]).trimLeft(),
    trimright: parameters => String(parameters[0]).trimRight(),
    reverse: parameters => String(parameters[0]).split('').reverse().join(''),
    length: parameters => String(parameters[0]).length,
    len: parameters => String(parameters[0]).length,
    concat: parameters => parameters.join(''),
}
const applyFunction = (funcVal: Func, sources: Record<string, object>, sourceDataObject: Record<string, object>) => {
    const parameters = funcVal.parameters.map(x => getValue(x, sources, sourceDataObject))
    const func = funcVal.name.toLowerCase()
    const toApply = functions[func]
    if (toApply) {
        return toApply(parameters)
    }
    throw new Error(`Unsupported function. Supported built-in functions are: ${Object.keys(functions).join(', ')}`)
}

const getValue = (
    operand: Operand | Field,
    values: Record<string, object>,
    sourceDataObject: Record<string, object>
) => {
    if (operand.type === 'fieldString') {
        const value = getIdentifierValue(values, operand)
        if (value !== undefined) {
            return value
        }
        return operand.field.value
    }
    if (
        operand.type === 'integer' ||
        operand.type === 'string' ||
        operand.type === 'array' ||
        operand.type === 'null' ||
        operand.type === 'expression'
    ) {
        return operand.value
    }
    if (operand.type === 'opIdentifier') {
        const { field } = operand
        return getIdentifierValue(values, field)
    }
    if (operand.type === 'selectStatement') {
        const array = executeQuery(operand.value, sourceDataObject)
        return array.map((x: any) => ({ value: x[operand.value.fields[0].field.value] }))
    }

    return getIdentifierValue(values, operand)
}

const mapper = (
    v: object,
    fields: Field[],
    sources: Record<string, object>,
    sourceDataObject: Record<string, object>
) => {
    if (fields.some(x => x.field.value === '*')) {
        return v
    }

    return mapObject(fields, sources, sourceDataObject)
}

function rowShouldBeincludedInResult(
    jointures: Jointure[],
    row: Row,
    sourceDataObject: Record<string, any>,
    where: Where | undefined | null
) {
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
                row.dataContext,
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

    if (!where || !where.conditions) {
        return true
    }
    const leftValue = where.conditions.left
    const rightValue = where.conditions.right
    const operation = where.conditions.operation

    const comparison = compareOperands(operation, leftValue, rightValue, row.dataContext, sourceDataObject)

    return comparison
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
