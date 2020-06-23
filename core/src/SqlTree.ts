import { operators } from './operators'

export type Operation = typeof operators[keyof typeof operators]

export interface From {
    name: PathValue
    alias: PathValue
    type: 'From'
}

export type Value = StringValue | NumberValue | PathValue

export interface NumberValue {
    value: number
    type: 'NumberValue'
}
export interface StringValue {
    value: string
    type: 'StringValue'
}
export interface PathValue {
    value: string
    values: string[]
    type: 'PathValue'
}

export interface Func {
    name: string
    parameters: Field[]
}

type FieldFunction = {
    name: Value
    field: PathValue
    type: 'fieldFunction'
    function: Func
}

type FieldString = {
    type: 'fieldString'
    field: PathValue
    name: StringValue
}
type FieldIdentifier = {
    type: 'fieldIdentifier'
    field: PathValue
    name: Value
}

export type Field = FieldString | FieldIdentifier | FieldFunction

export type FieldType = Field['type']

export type Operand =
    | {
          value: Value[]
          type: 'array'
      }
    | {
          field: Field
          value: string
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
