export const operators = {
    modulo: '%',
    or: 'or',
    and: 'and',
    equal: '=',
    is: 'is',
    notEqual: '!=',
    isNot: 'is not',
    '<>': '<>',
    greaterThan: '>',
    greaterOrEqualThan: '>=',
    lessThan: '<',
    lessOrEqualthan: '<=',
    in: 'in',
    like: 'like',
    notLike: 'not like',
} as const

export type Operation = typeof operators[keyof typeof operators]

export interface From {
    name: Value
    alias: Value
    type: 'From'
}

export interface Value {
    value: string | number
    values: (string | number)[]
}

export interface Func {
    name: string
}

export interface Field {
    field: Value
    name: Value
    function?: Func
}

export type Operand =
    | {
          value: Value[]
          values?: string[]
          operation: string
          type: 'identifier' | 'array'
      }
    | {
          operation: Operation
          value: Value[]
          type: 'expression'
          left: Operand
          right: Operand
      }
    | {
          value: number
          type: 'integer'
      }
    | {
          value: null
          type: 'null'
      }
    | {
          value: string
          type: 'string'
      }
    | {
          value: SQLTree
          type: 'selectStatement'
      }

export interface Conditions {
    left: Operand
    right: Operand
    operation: Operation
}
export interface Where {
    conditions: Conditions
}

export interface Limit {
    value: Value
}
export interface ordering {
    value: Value
    direction: 'desc' | 'asc'
}
export interface Order {
    orderings: ordering[]
}

export interface Join {
    conditions: Conditions
    from: From
}

export interface SQLTree {
    type: 'selectStatement'
    source: From
    where?: Where | null
    fields: Field[]
    limit: Limit | null
    order?: Order
    joins?: Join[]
}
