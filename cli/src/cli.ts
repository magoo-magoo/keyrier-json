#!/usr/bin/env node

import { executeQuery, jsonParseSafe, toAst } from '@keyrier/core'
import parse from 'csv-parse/lib/sync'
import EasyTable from 'easy-table'
import * as fs from 'fs'
import { Parser } from 'json2csv'
import meow from 'meow'
import updateNotifier from 'update-notifier'
import xlsx from 'xlsx'
import { name, version } from '../package.json'
import { readStdin } from './stdin'

// check for update
updateNotifier({ pkg: { name, version }, distTag: 'latest' }).notify({
    isGlobal: true,
})

export const defaultConfig = { outputType: 'table', outputFile: 'stdout' } as const

const cli = meow(
    `

Usage
  $ keyrier <query>

Options
    --help              display help
    --output, -o        output file path (default: ${defaultConfig.outputFile})
    --output-type, -t   output content type: table, json, csv or xlsx (default: ${defaultConfig.outputType}) 
    --verbose, -v       verbose
    --version           print version

Examples
  $ keyrier "select * from users.json"
  $ keyrier "select firstname, lastname, phoneNumber as phone from users.csv"
  $ keyrier "select name from users.json where age < 30" --output youngins.json
  $ wget -qO- https://jsonplaceholder.typicode.com/users | keyrier "select name as Nom, address.city as Ville from stdin" 
`,
    {
        flags: {
            verbose: {
                type: 'boolean',
                alias: 'v',
                default: false,
            },
            output: {
                type: 'string',
                alias: 'o',
                default: defaultConfig.outputFile,
            },
            outputType: {
                type: 'string',
                alias: 't',
                default: defaultConfig.outputType,
            },
        },
    }
)

const logDebug = (message: string | object) => {
    if (cli.flags.verbose) {
        console.error(typeof message === 'object' ? JSON.stringify(message, null, 2) : message)
    }
}

const inputTypes = ['file/csv', 'file/json', 'stdin/json'] as const
type InputType = typeof inputTypes[number]

const outputTypes = ['csv', 'json', 'table', 'xlsx'] as const
type OutputType = typeof outputTypes[number]

type QueryOptions = {
    outputType?: OutputType
    outputFile?: string
}

const outputTypeIsValid = (type: string): type is OutputType => outputTypes.filter(x => x === type).length > 0

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

    throw new Error(`Unknown file type: ${name}`)
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

export const query = async (q: string, opts: QueryOptions = {}) => {
    if (!q) {
        throw new Error()
    }

    const options = Object.assign<QueryOptions, QueryOptions>(defaultConfig, opts)
    logDebug({ options })

    const ast = toAst(q)
    logDebug({ ast })

    const fileType = getType(ast.source.name.value)
    logDebug({ fileType })

    let inputCcontent: string

    if (fileType === 'stdin/json') {
        inputCcontent = await readStdin()
    } else {
        inputCcontent = fs.readFileSync(ast.source.name.value, 'utf8')
    }

    if (!inputCcontent) {
        return
    }
    if (!options.outputFile) {
        return
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
        throw new Error(`${ast.source.name.value} is not a valid file`)
    }

    if (options.outputType === 'table') {
        const tableString = EasyTable.print(executionResult)
        if (options.outputFile === 'stdout') {
            console.log(tableString)
            return
        }
        fs.writeFileSync(options.outputFile, tableString, 'utf8')
        return
    }

    if (options.outputType === 'json') {
        if (options.outputFile === 'stdout') {
            console.log(JSON.stringify(executionResult, null, 2))
            return
        }
        fs.writeFileSync(options.outputFile, JSON.stringify(executionResult), 'utf8')
        return
    }

    if (options.outputType === 'csv') {
        const csv = toCsv(executionResult)
        if (options.outputFile === 'stdout') {
            console.log(csv)
            return
        }
        fs.writeFileSync(options.outputFile, csv, 'utf8')
        return
    }

    if (options.outputType === 'xlsx') {
        if (options.outputFile === 'stdout') {
            throw new Error('Specify a file.')
        }
        const workBook = xlsx.utils.book_new()
        const workSheet = xlsx.utils.json_to_sheet(Array.isArray(executionResult) ? executionResult : [executionResult])
        xlsx.utils.book_append_sheet(workBook, workSheet, 'keyrier-json')
        xlsx.writeFile(workBook, options.outputFile)
        return
    }

    throw new Error()
}

const toCsv = (data: object[] | object) => {
    const json2csvParser = new Parser({ quote: '"' })
    return json2csvParser.parse(data)
}

;(async function run() {
    logDebug({ cli })

    if (cli.input.length !== 1) {
        cli.showHelp(1)
    }

    const [queryArg] = cli.input
    const { output, outputType } = cli.flags

    if (!queryArg || !outputTypeIsValid(outputType)) {
        cli.showHelp(2)
        process.exit(2)
    }

    try {
        logDebug('starts execution')
        await query(queryArg, {
            outputFile: output,
            outputType: outputType,
        })
        logDebug('execution finished')
    } catch (e) {
        console.error(e.message)
        process.exit(6)
    }
})()
