import { toAst as toAstVisitor } from './actions-visitor'

describe('Chevrotain Tutorial', () => {
    it('Can convert a simple input to an AST', () => {
        const inputText = 'SELECT column1, column2 FROM table2 WHERE column2 > 3'
        const ast = toAstVisitor(inputText)

        expect(ast.type).toEqual('SELECT_STMT')

        expect(ast.selectClause.type).toEqual('SELECT_CLAUSE')
        expect(ast.selectClause.columns.type).toEqual('COLUMNS')
        expect(ast.selectClause.columns.values).toEqual(['column1', 'column2'])
        expect(ast.selectClause.columns.names).toEqual(['column1', 'column2'])

        expect(ast.fromClause.type).toEqual('FROM_CLAUSE')
        expect(ast.fromClause.table).toEqual('table2')

        expect(ast.whereClause.type).toEqual('WHERE_CLAUSE')
        expect(ast.whereClause.condition.lhs).toEqual('column2')
        expect(ast.whereClause.condition.operator).toEqual('>')
        expect(ast.whereClause.condition.rhs).toEqual('3')
        expect(ast.whereClause.condition.type).toEqual('EXPRESSION')
    })
    it.skip('should parse multiple where expression', () => {
        const inputText = "SELECT foo FROM bar WHERE foo = 'val' and truc < 42  "
        const ast = toAstVisitor(inputText)

        expect(ast.type).toEqual('SELECT_STMT')

        expect(ast.selectClause.type).toEqual('SELECT_CLAUSE')
        expect(ast.selectClause.columns.type).toEqual('COLUMNS')
        expect(ast.selectClause.columns.values).toEqual(['foo'])
        expect(ast.selectClause.columns.names).toEqual(['foo'])

        expect(ast.fromClause.type).toEqual('FROM_CLAUSE')
        expect(ast.fromClause.table).toEqual('bar')

        expect(ast.whereClause.type).toEqual('WHERE_CLAUSE')
        expect(ast.whereClause.condition.lhs.lhs).toEqual('truc')
        expect(ast.whereClause.condition.lhs.operator).toEqual('=')
        expect(ast.whereClause.condition.lhs.rhs).toEqual(42)
        expect(ast.whereClause.condition.lhs.type).toEqual('EXPRESSION')
        expect(ast.whereClause.condition.rhs.lhs).toEqual('truc')
        expect(ast.whereClause.condition.rhs.operator).toEqual('=')
        expect(ast.whereClause.condition.rhs.rhs).toEqual(42)
        expect(ast.whereClause.condition.rhs.type).toEqual('EXPRESSION')
    })

    it('should convert "as" expression', () => {
        const inputText = 'SELECT column1 as foo, column2, column3 as bar FROM table'
        const ast = toAstVisitor(inputText)

        expect(ast.selectClause.columns.values).toHaveLength(3)
        expect(ast.selectClause.columns.names).toHaveLength(3)
        expect(ast.selectClause.columns.names).toEqual(['foo', 'column2', 'bar'])
        expect(ast.selectClause.columns.values).toEqual(['column1', 'column2', 'column3'])
        expect(ast.fromClause.table).toEqual('table')
    })
})
