import { sqlQuery as sqlEvaluation } from '@keyrier/core'
import lodash from 'lodash'
import { QueryMode } from '../state/State'

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

    const evaluation = evaluate(sourceString, queryString, mode)
    if (evaluation instanceof Error) {
        return evaluation
    }
    return { obj: evaluation, text: JSON.stringify(evaluation) }
}

const evaluate = (sourceString: string, queryString: string, mode: QueryMode) => {
    if (mode === 'Javascript') {
        return jsEvaluation(sourceString, queryString)
    } else if (mode === 'SQL') {
        return sqlEvaluation(sourceString, queryString)
    }
    return new Error('unsupported mode')
}

const jsEvaluation = (sourceString: string, queryString: string): null | undefined | object | Error => {
    try {
        window._ = lodash
        const code = `
      
        const data = eval(${sourceString})
        ${queryString}
      `
        // eslint-disable-next-line
        const evaluation =  eval(code) // DANGEROUS
        // if (evaluation instanceof LodashWrapper){

        // }
        return evaluation
    } catch (error) {
        return error
    }
}
