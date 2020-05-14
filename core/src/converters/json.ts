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