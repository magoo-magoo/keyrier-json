export interface From {
    name: Value
    alias: Value
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
          operation: string
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
    operation: string
}
export interface Where {
    conditions: any
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
    source: From
    where?: Where | null
    fields: Field[]
    limit: Limit | null
    order?: Order
    joins: Join[]
}
