export interface From {
    name: Value
    alias?: Value
}

export interface Value {
    value: string | number
    values: (string | number)[]
}

export interface Field {
    field: Value
    name: Value
}

export interface Operand {
    value: string | number | Value[] | null
    values?: string[]
    operation: string
    left: Operand
    right: Operand
}
export interface Conditions {
    left: Operand
    right: Operand
    operation: string
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

export interface SQLTree {
    source: From
    where?: Where | null
    fields: Field[]
    limit: Limit | null
    order?: Order
}
