import { QueryMode } from 'state/State'
import { sqlEvaluation } from './sql'
import lodash from 'lodash'

export const codeEvaluation = (sourceString: string, queryString: string, mode: QueryMode) => {
    if (!sourceString || !queryString) {
        return null
    }

    if (sourceString.trim() === '') {
        return null
    }

    if (queryString.trim() === '') {
        return null
    }

    if (mode === 'Javascript') {
        return jsEvaluation(sourceString, queryString)
    } else if (mode === 'SQL') {
        return sqlEvaluation(sourceString, queryString)
    }

    return new Error('unsupported mode')
}

const jsEvaluation = (sourceString: string, queryString: string): null | string | Error => {
    try {
        window._ = lodash
        const code = `
      
        const data = eval(${sourceString})
        JSON.stringify(${queryString}) 
      `
        // eslint-disable-next-line
        const evaluatedQuery = eval(code) // DANGEROUS
        return evaluatedQuery
    } catch (error) {
        return error
    }
}
