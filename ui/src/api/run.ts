import { NowRequest, NowResponse } from '@now/node'
import { codeEvaluation } from '../../core/code'
export default async (request: NowRequest, response: NowResponse) => {
    const mode = request.query.mode
    const query = request.query.query
    const source = request.body

    if (mode !== 'SQL' && mode !== 'Javascript') {
        return response.status(400).send('Mode should be SQL or Javascript')
    }
    if (typeof query !== 'string') {
        return response.status(400).send('Invalid query')
    }

    const evaluated = codeEvaluation(JSON.stringify(source), query, mode)

    const queryResult = {
        evaluated,
        debug: {
            mode,
            query,
            source,
        },
    }

    return response.status(200).json(queryResult)
}
