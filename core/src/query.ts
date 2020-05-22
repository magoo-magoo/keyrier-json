import parse from 'csv-parse/lib/sync'
import * as fs from 'fs'
import { Parser } from 'json2csv'
import { jsonParseSafe } from './converters/json'
import { toAst } from './sql/actions-visitor'
import { executeQuery } from './sql/sql'
import { readStdin } from './stdin'

const InputTypes = ['file/csv', 'file/json', 'stdin/json', 'unknown_file_type'] as const
type InputType = typeof InputTypes[number]
type QueryOptions = {
    outputType?: 'csv' | 'json'
    outputFile?: string
}

const getType = (name: string | number): InputType => {
    if (isCSVfile(name)) {
        return 'file/csv'
    }
    if (isJSONfile(name)) {
        return 'file/json'
    }
    if (isStdinJSON(name)) {
        return 'stdin/json'
    }

    return 'unknown_file_type'
}

const isJSONfile = (name: string | number) => {
    if (/.*\.json/i.test(String(name))) {
        return true
    }
    return false
}
const isStdinJSON = (name: string | number) => {
    if (/stdin/i.test(String(name))) {
        return true
    }
    return false
}

const isCSVfile = (name: string | number) => {
    if (/.*\.csv/i.test(String(name))) {
        return true
    }
    return false
}

type QueryResult = {
    error?: Error
}
const query = async (query: string, opts: QueryOptions = {}): Promise<QueryResult> => {
    if (!query) {
        return { error: new Error() }
    }

    const options = Object.assign<QueryOptions, QueryOptions>({ outputType: 'json', outputFile: 'stdout' }, opts)

    try {
        const ast = toAst(query)

        const fileType = getType(ast.source.name.value)

        if (fileType === 'unknown_file_type') {
            return { error: new Error(fileType) }
        }

        let inputCcontent: string

        if (fileType === 'stdin/json') {
            inputCcontent = await readStdin()
        } else {
            inputCcontent = fs.readFileSync(ast.source.name.value, 'utf8')
        }

        if (!inputCcontent) {
            return {}
        }
        if (!options.outputFile) {
            return {}
        }

        let executionResult: object
        if (fileType === 'file/json' || fileType === 'stdin/json') {
            const sourceDataObject = jsonParseSafe(inputCcontent)
            executionResult = executeQuery(
                { ...ast, source: { name: { value: 'json', values: ['json'] } } },
                sourceDataObject
            )
        } else if (fileType === 'file/csv') {
            const sourceDataObject = parse(inputCcontent, {
                columns: true,
                skip_empty_lines: true,
            })
            executionResult = executeQuery(
                { ...ast, source: { name: { value: 'csv', values: ['csv'] } } },
                sourceDataObject
            )
        } else {
            return { error: new Error(`${ast.source.name.value} is not a valid file`) }
        }

        if (options.outputType === 'json') {
            if (options.outputFile === 'stdout') {
                console.table(executionResult)
            }
            fs.writeFileSync(options.outputFile, JSON.stringify(executionResult), 'utf8')
            return {}
        } else if (options.outputType === 'csv') {
            const csv = toCsv(executionResult)
            if (options.outputFile === 'stdout') {
                console.log(csv)
                return {}
            }
            fs.writeFileSync(options.outputFile, csv, 'utf8')
            return {}
        }

        throw new Error()
    } catch (error) {
        return { error }
    }
}

function toCsv(data: object[] | object) {
    const json2csvParser = new Parser({ quote: '"' })
    return json2csvParser.parse(data)
}
export default query
