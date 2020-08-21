export const customToString = (obj: unknown): string => {
    if (Array.isArray(obj)) {
        return obj.map((e) => customToString(e)).join(',')
    }
    if (typeof obj === 'object') {
        return JSON.stringify(obj)
    }
    if (obj !== null && obj !== undefined) {
        return (obj as any).toString()
    }

    return ''
}

export const takeFirst = (str: string | null | undefined, n: number) => {
    if (typeof str !== 'string') {
        return null
    }
    if (str.length <= n) {
        return str
    }
    return `${str.substring(0, n)}...`
}

export const containsIgnoreCase = (str: string, part: string) => {
    if (!str || !part) {
        return false
    }
    if (str.toLocaleLowerCase().includes(part.toLocaleLowerCase())) {
        return true
    }

    return false
}

const UNITS = ['B', 'kB', 'MB', 'GB']

export const prettyPrintBytes = (value: number) => {
    if (!Number.isFinite(value)) {
        throw new TypeError(`Expected a finite number, got ${typeof value}: ${value}`)
    }

    const isNegative = value < 0
    const prefix = isNegative ? '-' : ''
    if (isNegative) {
        value = -value
    }
    if (value < 1) {
        const numberStr = value.toString()
        return prefix + numberStr + ' B'
    }
    const exponent = Math.min(Math.floor(Math.log10(value) / 3), UNITS.length - 1)
    value = Number((value / Math.pow(1024, exponent)).toPrecision(3))
    const numberString = value.toString()
    const unit = UNITS[exponent]
    return prefix + numberString + ' ' + unit
}
