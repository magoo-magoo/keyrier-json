import fs from 'fs'
import mockFs from 'mock-fs'
import mockstdin, { MockStdin } from '../mock-stdin'
import query from '../query'

describe('query', () => {
    let fakeStdin: MockStdin
    beforeEach(() => {
        fakeStdin = mockstdin.mock()
        jest.spyOn(console, 'table').mockImplementation(() => {
            throw new Error()
        })
    })

    afterEach(() => {
        mockstdin.restore()
        mockFs.restore()
        jest.resetAllMocks()
    })

    it('should exec query on selected json file', async () => {
        // arrange
        mockFs({
            'fake/dir/users.json': '[{"email": "mael.magoo@test.com"}]',
        })
        jest.spyOn(console, 'table')

        // act
        await query('select * from fake/dir/users.json')

        // assert
        expect(console.table).toBeCalledWith([{ email: 'mael.magoo@test.com' }])
    })

    it('should exec query on selected csv file', async () => {
        // arrange
        mockFs({
            'fake/dir/fake.csv': `"key_1","key_2"
"value 1","value 2"`,
        })
        let printed: any
        jest.spyOn(console, 'table').mockImplementation(v => (printed = v))

        // act
        const { error } = await query('select * from fake/dir/fake.csv')

        // assert
        expect(error).not.toBeDefined()
        expect(printed).toEqual([{ key_1: 'value 1', key_2: 'value 2' }])
    })
    it('should return null if json file emty', async () => {
        // arrange
        mockFs({
            'fake/dir/fake.json': '',
        })

        // act
        const { error } = await query('select * from fake/dir/fake.json')

        // assert
        expect(error).not.toBeDefined()
    })
    it('should return null if csv file emty', async () => {
        mockFs({
            'fake/dir/fake.csv': '',
        })

        // act
        const { error } = await query('select * from fake/dir/fake.csv')

        // assert
        expect(error).not.toBeDefined()
    })

    it('should return an error if file doesnt file', async () => {
        // arrange

        // act
        const { error } = await query('select * from fake/dir/fake.csv')

        // assert
        expect(error!.message).toContain('no such file or directory')
    })

    it('should write result to CSV file', async () => {
        // arrange
        mockFs({
            'fake/dir/users.json': '[{"email": "mael.magoo@test.com"}]',
            'fake/dir/output.csv': '',
        })

        // act
        await query('select * from fake/dir/users.json', { outputType: 'csv', outputFile: 'fake/dir/output.csv' })
        const output = fs.readFileSync('fake/dir/output.csv', 'utf-8')

        // assert
        expect(output).toEqual('"email"\n"mael.magoo@test.com"')
    })

    it('should read stdin', async () => {
        // arrange
        mockFs({
            'fake/dir/output.csv': '',
        })
        process.nextTick(() => {
            fakeStdin.send('[{"foo": "bar", "notSelected": "value"}]')
            fakeStdin.end()
        })

        // act
        const { error } = await query('select foo from stdin', {
            outputType: 'json',
            outputFile: 'fake/dir/output.csv',
        })
        const output = fs.readFileSync('fake/dir/output.csv', 'utf-8')

        // assert
        expect(error).not.toBeDefined()
        expect(output).toEqual('[{"foo":"bar"}]')
    })
})
