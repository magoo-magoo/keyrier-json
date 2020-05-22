#!/usr/bin/env node

import { query } from '@keyrier/core'
import meow from 'meow'
import updateNotifier from 'update-notifier'
import { name, version } from '../package.json'

// check for update
updateNotifier({ pkg: { name, version }, distTag: 'latest' }).notify({ isGlobal: true })

const cli = meow(
    `
Usage
  $ keyrier <query>

Options
    --help              display help
    --output, -o        output file path (default: stdout)
    --output-type, -t   output content type: json or csv (default: json) 
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
                default: 'stdout',
            },
            outputType: {
                type: 'string',
                alias: 't',
                default: 'json',
            },
        },
    }
)

const logDebug = (message: string | object) => {
    if (cli.flags.verbose) {
        console.log(message)
    }
}

const outputTypeIsValid = (type: string): type is 'json' | 'csv' => {
    if (type === 'json') {
        return true
    }
    if (type === 'csv') {
        return true
    }
    return false
}
;(async function run() {
    if (cli.input.length !== 1) {
        cli.showHelp(1)
    }

    const [queryArg] = cli.input
    const { output, outputType } = cli.flags

    if (!queryArg || !outputTypeIsValid(outputType)) {
        process.exit(2)
    }

    try {
        logDebug('starts execution')
        const { error } = await query(queryArg, {
            outputFile: output,
            outputType: outputType,
        })
        if (error) {
            console.error(error)
            process.exit(5)
        }
        logDebug('execution finished')
    } catch (e) {
        console.error(e)
        process.exit(6)
    }
})()
