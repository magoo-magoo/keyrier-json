#!/usr/bin/env node

import { sqlQuery } from '@keyrier/core'
import fs from 'fs'
import meow from 'meow'
import updateNotifier from 'update-notifier'
import { name, version } from '../package.json'

// check for update
updateNotifier({ pkg: { name, version }, distTag: 'latest' }).notify({ isGlobal: true })

const logDebug = (message: string | object) => {
    if (cli.flags.verbose) {
        console.log(message)
    }
}

const readStdin = () => {
    const { stdin } = process
    let result = ''

    return new Promise<string>(resolve => {
        if (stdin.isTTY) {
            resolve(result)
            return
        }

        stdin.setEncoding('utf8')

        stdin.on('readable', () => {
            let chunk: string

            while ((chunk = stdin.read())) {
                result += chunk
            }
        })

        stdin.on('end', () => {
            resolve(result)
        })
    })
}

const cli = meow(
    `
Usage
  $ keyrier <query> <file>

Options
    --help              display help
    --output, o         output file path (default: stdout)
    --verbose, -v       verbose
    --version           print version

Examples
  $ keyrier "select * from json" users.json
  $ keyrier "select firstname, lastname, phoneNumber as phone from json" users.json
  $ keyrier "select name from json where age < 30" users.json --output youngins.json
  $ wget -qO- https://jsonplaceholder.typicode.com/users | keyrier "select name as Nom, address.city as Ville from json" 
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

if (cli.input.length <= 0 || cli.input.length > 2) {
    cli.showHelp(1)
}

const [queryArg, filePathArg] = cli.input
const { output } = cli.flags

const exec = async (query: string, filepath: string, outputFile: string) => {
    logDebug({ query })
    logDebug({ filepath })
    logDebug('starts execution')

    let fileContent = ''
    if (filepath === 'stdin') {
        fileContent = await readStdin()
        if (fileContent === '') {
            console.log(`
            provide a file or use stdin
            keyrier --help
            `)
            process.exit(3)
        }
    } else {
        // assert file exists
        fs.accessSync(filepath, fs.constants.F_OK)

        // get file content
        fileContent = fs.readFileSync(filepath, 'utf-8')
    }
    logDebug({ fileContent })

    // perfoms SQL query
    const result = sqlQuery(fileContent, query)

    if (result instanceof Error) {
        console.error(result)
        process.exit(5)
    }
    if (typeof result !== 'object') {
        console.log(`
        provide a valid JSON input
        keyrier --help
        `)
        process.exit(4)
    }
    if (outputFile === 'stdout') {
        console.table(result)
    } else {
        fs.writeFileSync(outputFile, JSON.stringify(result), { encoding: 'utf-8' })
    }

    logDebug('execution finished')
}
exec(queryArg, filePathArg ?? 'stdin', output)
    .then(() => logDebug('exiting with no issue'))
    .catch(() => logDebug('crashed!'))
