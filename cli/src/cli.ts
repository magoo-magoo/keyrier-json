#!/usr/bin/env node

import { sqlQuery } from '@keyrier/core'
import fs from 'fs'
import meow from 'meow'

const logDebug = (message: string | object) => {
    if (cli.flags.verbose) {
        console.log(message)
    }
}
const cli = meow(
    `
Usage
  $ keyrier <query> <file>

Options
    --help              display help
    --outout            output file path (default: stdout)
    --verbose, -v       verbose
    --version           print version

Examples
  $ keyrier "select * from data" users.json
  $ keyrier "select name from data where age < 30" users.json --output youngins.json
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
                default: 'stdout',
            },
            input: {
                type: 'string',
                alias: 'f',
                default: '',
            },
        },
    }
)

if (cli.input.length !== 2) {
    cli.showHelp(1)
}
const [queryArg, filePathArg] = cli.input
const { output } = cli.flags

const exec = (query: string, filepath: string, outputFile: string) => {
    logDebug({ query })
    logDebug({ filepath })
    logDebug('starts execution')

    // assert file exists
    fs.accessSync(filepath, fs.constants.F_OK)

    // get file content
    const fileContent = fs.readFileSync(filepath, 'utf-8')
    logDebug({ fileContent })

    // perfoms SQL query
    const result = sqlQuery(fileContent, query)

    const resultIsArray = Array.isArray(result)
    logDebug({ resultIsArray })

    if (outputFile === 'stdout') {
        console.table(result)
    } else {
        fs.writeFileSync(outputFile, JSON.stringify(result), { encoding: 'utf-8' })
    }

    logDebug('execution finished')
}
exec(queryArg, filePathArg, output)
