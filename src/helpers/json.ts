import { logError } from './logger'

export const jsonBeautify = (str: string) => {
  if (!str || str.trim() === '') {
    return ''
  }

  const parsed = jsonParseSafe(str)
  if (typeof parsed === 'string') {
    return parsed
  }

  try {
    return JSON.stringify(parsed, null, 2)
  } catch (error) {
    logError(error, str)
  }
  return str
}

export const jsonParseSafe = (str: string) => {
  if (!str || str.trim() === '') {
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
    .replace(/[\u0000-\u0019]+/g, '')

  try {
    return JSON.parse(safeStr)
  } catch (error) {
    return str
  }
}
