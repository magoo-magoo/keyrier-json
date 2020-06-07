import { operators } from './operators'

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

export type FieldType = 'fieldIdentifier' | 'fieldString'
export type Field =
    | {
          type: FieldType
          field: Value
          name: Value
      }
    | {
          name: Value
          field: Value
          type: 'fieldFunction'
          function: Func
      }
export type Operand =
    | {
          value: Value[]
          values?: string[]
          type: 'array'
      }
    | {
          field: Field
          value: string
          values?: string[]
          type: 'opIdentifier'
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
