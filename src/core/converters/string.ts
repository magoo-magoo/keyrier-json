export const customToString = (obj: {}): string => {
    if (Array.isArray(obj)) {
        const array: any[] = obj
        return array.map(e => customToString(e)).join(',')
    }
    if (typeof obj === 'object') {
        return JSON.stringify(obj)
    }
    if (typeof obj === 'undefined') {
        return ''
    }
    if (obj !== null && obj !== undefined) {
        return obj.toString()
    }

    return ''
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

const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

const toLocaleString = (value: number, locale: boolean | string = false) => {
    let result = value.toString()
    if (typeof locale === 'string') {
        result = value.toLocaleString(locale)
    } else if (locale === true) {
        result = value.toLocaleString()
    }

    return result
}

export const prettyPrintBytes = (value: number, signed = false, locale: boolean | string = false) => {
    if (!Number.isFinite(value)) {
        throw new TypeError(`Expected a finite number, got ${typeof value}: ${value}`)
    }
    if (value === 0) {
        return '0 B'
    }
    const isNegative = value < 0
    const prefix = isNegative ? '-' : signed ? '+' : ''
    if (isNegative) {
        value = -value
    }
    if (value < 1) {
        const numberStr = toLocaleString(value, locale ? locale : false)
        return prefix + numberStr + ' B'
    }
    const exponent = Math.min(Math.floor(Math.log10(value) / 3), UNITS.length - 1)
    value = Number((value / Math.pow(1024, exponent)).toPrecision(3))
    const numberString = toLocaleString(value, locale ? locale : false)
    const unit = UNITS[exponent]
    return prefix + numberString + ' ' + unit
}
