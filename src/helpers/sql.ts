import _ from 'lodash'
import { parse, nodes, Op, Field, SQLTree } from 'sql-parser'
import { jsonParseSafe } from './json'

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

const mapWithFields = (v: object, fields: Field[]) => {
  let mapped = v
  if (fields[0].constructor !== nodes.Star) {
    const temp: any = {}
    fields.forEach(field => {
      const value = _.get(mapped, field.field.values)
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
  }

  return mapped
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
      .map(v => mapWithFields(v, sqlTree.fields))
      .value()
  } else {
    return mapWithFields(result.value(), sqlTree.fields)
  }
}

export const sqlEvaluation = (sourceString: string, queryString: string) => {
  try {
    const sqlTree = parse(queryString)

    if (sqlTree.source.name.values[0] !== 'data') {
      return new Error(`${sqlTree.source.name.values[0]} table does not exist`)
    }

    const sourceDataObject: object = jsonParseSafe(sourceString)

    const result = executeQuery(sqlTree, sourceDataObject)

    return JSON.stringify(result)
  } catch (e) {
    return e
  }
}

const compareOperands = (operation: string | null, left: Op, right: Op, value: object): boolean => {
  if (operation) {
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
  }

  if (!left.value) {
    return false
  }

  if (!operation) {
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

  return false
}
