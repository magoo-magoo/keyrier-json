import { toAst } from './actions-visitor'

describe('actions-visitor', () => {
    it('Can convert a simple input to an AST', () => {
        const inputText = 'SELECT column1, column2 FROM table2 WHERE column2 > 3'
        const ast = toAst(inputText)

        expect(ast.fields).toHaveLength(2)
        expect(ast.fields[0]).toEqual({
            type: 'fieldIdentifier',
            name: { value: 'column1', values: ['column1'] },
            field: { value: 'column1', values: ['column1'] },
        })
        expect(ast.fields[1]).toEqual({
            type: 'fieldIdentifier',
            name: { value: 'column2', values: ['column2'] },
            field: { value: 'column2', values: ['column2'] },
        })

        expect(ast.source.name.value).toEqual('table2')

        expect(ast.where?.conditions?.left?.value).toEqual('column2')
        expect(ast.where?.conditions?.operation).toEqual('>')
        expect(ast.where?.conditions?.right?.value).toEqual(3)
    })
    it('Can convert with special chars to an AST', () => {
        const inputText = `SELECT "\n" FROM table`
        const ast = toAst(inputText)

        expect(ast.fields).toHaveLength(1)
        expect(ast.fields[0]).toEqual({
            type: 'fieldString',
            name: { value: '\n', values: ['\n'] },
            field: { value: '\n', values: ['\n'] },
        })

        expect(ast.source.name.value).toEqual('table')
    })

    it('should parse multiple where expression', () => {
        const inputText = "SELECT foo FROM bar WHERE foo = 'val' and truc < 42 or prop = 99"
        const ast = toAst(inputText) as any
        expect(ast.fields[0]).toEqual({
            type: 'fieldIdentifier',
            name: { value: 'foo', values: ['foo'] },
            field: { value: 'foo', values: ['foo'] },
        })

        expect(ast.source.name.value).toEqual('bar')

        expect(ast.where?.conditions?.operation).toEqual('and')

        expect(ast.where?.conditions?.left?.left?.value).toEqual('foo')
        expect(ast.where?.conditions?.left!.operation).toEqual('=')
        expect(ast.where?.conditions?.left?.right?.value).toEqual('val')

        expect(ast.where?.conditions?.right?.operation).toEqual('or')

        expect(ast.where?.conditions?.right?.left?.left?.value).toEqual('truc')
        expect(ast.where?.conditions?.right?.left?.operation).toEqual('<')
        expect(ast.where?.conditions?.right?.left?.right?.value).toEqual(42)

        expect(ast.where?.conditions?.right?.right?.left?.value).toEqual('prop')
        expect(ast.where?.conditions?.right?.right?.operation).toEqual('=')
        expect(ast.where?.conditions?.right?.right?.right?.value).toEqual(99)
    })

    it('should convert "as" expression', () => {
        const inputText = 'SELECT column1 as foo, column2, column3 as bar FROM table'
        const ast = toAst(inputText)

        expect(ast.fields[0]).toEqual({
            type: 'fieldIdentifier',
            name: { value: 'foo', values: ['foo'] },
            field: { value: 'column1', values: ['column1'] },
        })
        expect(ast.fields[1]).toEqual({
            type: 'fieldIdentifier',
            name: { value: 'column2', values: ['column2'] },
            field: { value: 'column2', values: ['column2'] },
        })
        expect(ast.fields[2]).toEqual({
            type: 'fieldIdentifier',
            name: { value: 'bar', values: ['bar'] },
            field: { value: 'column3', values: ['column3'] },
        })

        expect(ast.source.name.value).toEqual('table')
    })

    it.each`
        input
        ${''}
        ${'select'}
        ${'select *'}
        ${'select null from table'}
        ${'select * from'}
        ${'select * from like'}
        ${'select * from null'}
        ${'select * from table limit'}
        ${'select * from table order by'}
        ${'select * from table order by null'}
        ${'select * from table order by limit'}
        ${'select * from table limit "2"'}
    `('should throw an error if input is not invalid', ({ input }) => {
        expect(() => toAst(input)).toThrow()
    })

    it('should parse sub query statement', () => {
        const tree = toAst('SELECT column1 FROM table1 where column1 in ( select column2 from table2 )')
        expect(tree).toBeDefined()
        expect(tree.where!.conditions!.left!.value!).toEqual('column1')
        expect(tree.where!.conditions!.operation).toEqual('in')
        expect(tree.where!.conditions.right.value).toBeDefined()
    })

    it('should parse join query statement', () => {
        const tree = toAst(
            `SELECT 
            table1.addr as col1 
            FROM table1 
            inner join table2 on table1.name = table2.column3
            inner join table3 on table1.email = table2.column4
            `
        )
        expect(tree).toBeDefined()
        expect(Array.isArray(tree.joins)).toBeTruthy()
        expect(tree.joins).toHaveLength(2)
    })
})
