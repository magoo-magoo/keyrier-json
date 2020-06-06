export const jsonParseSafe = (str: string | null) => {
    if (typeof str !== 'string' || str.trim() === '') {
        return null
    }

    const safeStr = str
        .replace(/\\n/g, '\\n')
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, '\\&')
        .replace(/\\r/g, '\\r')
        .replace(/\\t/g, '\\t')
        .replace(/\\b/g, '\\b')
        .replace(/\\f/g, '\\f')

    try {
        return JSON.parse(safeStr)
    } catch (error) {
        return str
    }
}

export const get = (obj: any, path: (string | number)[], defaultValue: any = undefined) => {
    const travel = (regexp: any) =>
        String.prototype.split
            .call(path, regexp)
            .filter(Boolean)
            .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
    return result === undefined || result === obj ? defaultValue : result
}

const slice = (array: any[], start: number, end: number) => {
    let length = array == null ? 0 : array.length
    if (!length) {
        return []
    }
    start = start == null ? 0 : start
    end = end === undefined ? length : end

    if (start < 0) {
        start = -start > length ? 0 : length + start
    }
    end = end > length ? length : end
    if (end < 0) {
        end += length
    }
    length = start > end ? 0 : (end - start) >>> 0
    start >>>= 0

    let index = -1
    const result = new Array(length)
    while (++index < length) {
        result[index] = array[index + start]
    }
    return result
}
export const take = (array: any[], n = 1) => {
    if (!(array != null && array.length)) {
        return []
    }

    return slice(array, 0, n < 0 ? 0 : n)
}

export const assertIsDefined = <T = {}>(value: T): value is NonNullable<T> => {
    if (value) {
        return true
    }
    throw new Error()
}
