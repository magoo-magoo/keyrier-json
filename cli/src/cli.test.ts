import execa from 'execa'
import fs from 'fs'
import path from 'path'

import { version } from '../package.json'

const keyrier = async (...args: string[]) => {
    return await execa(fixturePath, args)
}

const fixturePath = path.join(__dirname, '../dist', 'index.js')

describe('Keyrier CLI', () => {
    beforeEach(() => {
        fs.rmdirSync('tests', { recursive: true })
        fs.mkdirSync('tests/output', { recursive: true })
    })

    afterEach(() => {
        fs.rmdirSync('tests', { recursive: true })
    })

    it('shows version', async () => {
        const { stdout } = await execa(fixturePath, ['--version'])
        expect(stdout).toEqual(version)
    })

    it('should exec query on selected json file', async () => {
        // arrange
        fs.writeFileSync('tests/users.json', `[{"email": "mael.magoo@test.com"}]`, 'utf8')

        // act
        const { stdout, exitCode } = await keyrier('select * from tests/users.json')

        // assert
        expect(exitCode).toEqual(0)
        expect(stdout).toContain('email')
        expect(stdout).toContain('mael.magoo@test.com')
    })

    it('should exec query on selected csv file', async () => {
        // arrange
        fs.writeFileSync('tests/fake.csv', `"key_1","key_2"\n"value 1","value 2"`, 'utf8')

        // act
        const { stdout } = await keyrier('select * from tests/fake.csv')

        // assert
        expect(stdout).toContain('key_1')
        expect(stdout).toContain('key_2')
        expect(stdout).toContain('value 1')
        expect(stdout).toContain('value 2')
    })

    it('should return null if json file empty', async () => {
        // arrange
        fs.writeFileSync('tests/fake.json', '', 'utf8')

        // act
        const { exitCode, stdout } = await keyrier('select * from tests/fake.json')

        // assert
        expect(exitCode).toBe(0)
        expect(stdout).toBe('')
    })

    it('should return null if csv file empty', async () => {
        // arrange
        fs.writeFileSync('tests/fake.csv', '', 'utf8')

        // act
        const { stdout, exitCode } = await keyrier('select * from tests/fake.csv')

        // assert
        expect(exitCode).toBe(0)
        expect(stdout).toBe('')
    })

    it('should return an error if file doesnt file', async () => {
        await expect(keyrier('select * from fake/dir/fake.csv')).rejects.toBeInstanceOf(Error)
    })

    it('should write result to CSV file', async () => {
        // arrange
        fs.writeFileSync('tests/users.json', `[{"email": "mael.magoo@test.com"}]`, 'utf8')

        // act
        await keyrier('select * from tests/users.json', '-t', 'csv', '-o', 'tests/output/output.csv')
        const output = fs.readFileSync('tests/output/output.csv', 'utf-8')

        // assert
        expect(output).toEqual('"email"\n"mael.magoo@test.com"')
    })

    it('should read stdin', async () => {
        // arrange

        // act
        const { exitCode } = await execa(fixturePath, ['select foo from stdin', '-t', 'json', '-o', 'tests/output/output.csv'], {
            input: '[{"foo": "bar", "notSelected": "value"}]',
        })
        const output = fs.readFileSync('tests/output/output.csv', 'utf-8')

        // assert
        expect(exitCode).toBe(0)
        expect(output).toEqual('[{"foo":"bar"}]')
    })
})
