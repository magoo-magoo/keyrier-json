import { QueryMode } from 'state/State'
import { sqlEvaluation } from './sql'
import lodash from 'lodash'

export const codeEvaluation = (sourceString: string, queryString: string, mode: QueryMode) => {
    if (!sourceString || !queryString) {
        return ''
    }
    if (mode === 'Javascript') {
        return jsEvaluation(sourceString, queryString)
    } else if (mode === 'SQL') {
        return sqlEvaluation(sourceString, queryString)
    }

    return new Error('unsupported mode')
}

const jsEvaluation = (sourceString: string, queryString: string): null | string | Error => {
    if (!sourceString || sourceString.trim() === '') {
        return null
    }

    if (!queryString || queryString.trim() === '') {
        return null
    }
    const currentWindow: any = typeof window === 'undefined' ? {} : window
    try {
        currentWindow._ = lodash
        const code = `
      
        const data = eval(${sourceString})
        JSON.stringify(${queryString}) 
      `
        // eslint-disable-next-line
        const evaluatedQuery = eval.apply(null, [code]) // DANGEROUS
        const type = typeof evaluatedQuery
        if (type !== 'string') {
            return null
        }
        return evaluatedQuery as string
    } catch (error) {
        return error
    } finally {
        currentWindow._ = undefined
    }
}
