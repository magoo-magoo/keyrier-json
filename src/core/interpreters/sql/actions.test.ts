import { toAst as toAstVisitor } from './actions-visitor'

describe('Chevrotain Tutorial', () => {
  it('Can convert a simple input to an AST', () => {
    const inputText = 'SELECT column1, column2 FROM table2 WHERE column2 > 3'
    const ast = toAstVisitor(inputText)

    expect(ast).toEqual({
      type: 'SELECT_STMT',
      selectClause: {
        type: 'SELECT_CLAUSE',
        columns: ['column1', 'column2'],
      },
      fromClause: {
        type: 'FROM_CLAUSE',
        table: 'table2',
      },
      whereClause: {
        condition: {
          lhs: 'column2',
          operator: '>',
          rhs: '3',
          type: 'EXPRESSION',
        },
        type: 'WHERE_CLAUSE',
      },
    })
  })
})
