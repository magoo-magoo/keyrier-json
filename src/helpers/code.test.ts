import { codeEvaluation } from './code'
import { computePath } from './sql'

describe('code helpers', () => {
  it('should eval simple object', () => {
    const result = codeEvaluation('{"a": 1}', 'data.a', 'Javascript')
    expect(result).toEqual('1')
  })

  it('should eval empty array', () => {
    const result = codeEvaluation('[]', 'data', 'Javascript')
    expect(result).toEqual('[]')
  })

  it('should returns an error with bad code', () => {
    const result = codeEvaluation('{"a": 1}', 'data.', 'Javascript')
    expect(result).toBeInstanceOf(Error)
  })

  it('should eval code with lodash', () => {
    const result = codeEvaluation(
      '{"results": [{"val": 42, "notMapped": "toto"}]}',
      `
    _.chain(data)
    .get('results')
    .map(d => _.pick(d, ['val' ]))
    
    `,
      'Javascript'
    )
    expect(result).toBe('[{"val":42}]')
  })

  it('should returns an error with bad SQL query - from missing', () => {
    const result = codeEvaluation('{"a": 1}', 'select * data', 'SQL')
    expect(result).toBeInstanceOf(Error)
  })
  it('should returns an error with bad SQL query - bad table', () => {
    const result = codeEvaluation('{"a": 1}', 'select * from ddata', 'SQL')
    expect(result).toBeInstanceOf(Error)
  })

  it('should returns a simple object for select star from data SQL query', () => {
    const result = codeEvaluation('{"a": 1, "b": 42}', 'select * from data', 'SQL')
    expect(JSON.parse(result as any)).toEqual({ a: 1, b: 42 })
  })

  it('should select correct column SQL query', () => {
    const result = codeEvaluation('{"a": 1, "b": 42, "c": 999}', 'select a, c from data', 'SQL')
    expect(JSON.parse(result as any)).toEqual({ a: 1, c: 999 })
  })

  it('should returns sub object for select star from data.child SQL query', () => {
    const result = codeEvaluation('{"a": 1, "b": 42, "child":[{"son":true}]}', 'select * from data.child', 'SQL')
    expect(JSON.parse(result as any)).toEqual([{ son: true }])
  })

  it('should select correct column when source is an array', () => {
    const result = codeEvaluation('[{"id": 1, "field": 42}, {"id": 2, "foo": "bar"}]', 'select id from data', 'SQL')
    expect(JSON.parse(result as any)).toEqual([{ id: 1 }, { id: 2 }])
  })

  it('should return 2 items array when limit is 2', () => {
    const result = codeEvaluation(
      '[{"id": 1, "field": 42}, {"id": 2, "foo": "bar"},  {"id": 3, "field": "value"}]',
      'select id from data limit 2',
      'SQL'
    )
    expect(JSON.parse(result as any)).toEqual([{ id: 1 }, { id: 2 }])
  })
  it('should returns filtered results with where clause - in - SQL query', () => {
    const result = codeEvaluation(
      '[{"id": 1, "field": 42}, {"id": 2, "foo": "bar"},  {"id": 3, "field": "value"}]',
      'select id from data where id in (1, 3)',
      'SQL'
    )
    expect(JSON.parse(result as any)).toEqual([{ id: 1 }, { id: 3 }])
  })

  it('should rename column whith As keyword correct column SQL query', () => {
    const result = codeEvaluation(
      '{"age": 1, "name": "John Doe", "c": 999}',
      'select age, name as fullName from data',
      'SQL'
    )
    expect(JSON.parse(result as any)).toEqual({ age: 1, fullName: 'John Doe' })
  })

  it('should rename column whith As keyword correct column when source is an array SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 1, "name": "John Doe", "c": 999}]',
      'select age, name as fullName from data',
      'SQL'
    )

    expect(JSON.parse(result as any)).toEqual([{ age: 1, fullName: 'John Doe' }])
  })

  it('should returns filtered results with where clause - SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
      'select name as fullName from data where age = 42',
      'SQL'
    )
    expect(result).toBeDefined()
    expect(JSON.parse(result as any)).toEqual([{ fullName: 'John Doe' }])
  })

  it('should returns filtered results with where clause- like operator - SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
      'select name as fullName from data where name like "Joh%"',
      'SQL'
    )
    expect(result).toBeDefined()
    expect(JSON.parse(result as any)).toEqual([{ fullName: 'John Doe' }])
  })
  it('should returns filtered results with where clause- like operator - SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
      'select name as fullName from data where name like "%y%"',
      'SQL'
    )
    expect(result).toBeDefined()
    expect(JSON.parse(result as any)).toEqual([{ fullName: 'Danny de Vito' }])
  })
  it('should returns filtered results with where clause- like operator - SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
      'select name as fullName from data where name like "%ohn%"',
      'SQL'
    )
    expect(result).toBeDefined()
    expect(JSON.parse(result as any)).toEqual([{ fullName: 'John Doe' }])
  })

  it('should returns filtered results with where clause- like operator - SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
      'select name as fullName from data where name like "%oe"',
      'SQL'
    )
    expect(result).toBeDefined()
    expect(JSON.parse(result as any)).toEqual([{ fullName: 'John Doe' }])
  })

  it.each`
    path                               | expected
    ${['field']}                       | ${['field']}
    ${['data', 'field']}               | ${['field']}
    ${['child', 'value', 'something']} | ${['child', 'value', 'something']}
  `('returns $expected when given path is $path', ({ path, expected }) => {
    const result = computePath(path)
    expect(result).toEqual(expected)
  })

  it('should returns filtered results with deep where clause - SQL query', () => {
    const result = codeEvaluation(
      '[{"id": 42, "child": {"foo": "bar"}},{"id": 666, "child": {"foo": "devil"}}]',
      "select id from data where child.foo = 'bar'",
      'SQL'
    )
    expect(result).toBeDefined()
    expect(JSON.parse(result as any)).toEqual([{ id: 42 }])
  })

  it('should returns filtered results with where clause -handle OR - SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"},  {"age": 84, "name": "Macron Manu"}]',
      'select name as fullName from data where age = 42 or age = 21',
      'SQL'
    )
    expect(result).toBeDefined()
    expect(JSON.parse(result as any)).toEqual([{ fullName: 'John Doe' }, { fullName: 'Danny de Vito' }])
  })

  it('should select sub object field', () => {
    const result = codeEvaluation(
      `[{"child" : {
                    "foo": { "field" : "bar" }
                  }
        }
      ]`,
      'select child.foo.field from data',
      'SQL'
    )

    expect(JSON.parse(result as any)).toEqual([{ field: 'bar' }])
  })

  it('should select correct path for array field', () => {
    const result = codeEvaluation(
      `
      {
        "arrayField": [
          {
            "field1": 42,
            "field2": "foo"
          },
          {
            "field1": 0,
            "field2": "bar",
            "field3": "tesla"
          },
          {
            "field1": 66,
            "field2": "test"
          }
        ]
      }
      `,
      `select field1, field2 from data.arrayField`,
      'SQL'
    )

    expect(JSON.parse(result as any)).toEqual([
      { field1: 42, field2: 'foo' },
      { field1: 0, field2: 'bar' },
      {
        field1: 66,
        field2: 'test',
      },
    ])
  })
  it('should select correct path for array field with where clause', () => {
    const result = codeEvaluation(
      `
      {
        "arrayField": [
          {
            "field1": 42,
            "field2": "foo"
          },
          {
            "field1": 0,
            "field2": "bar",
            "field3": "tesla"
          },
          {
            "field1": 66,
            "field2": "test"
          }
        ]
      }
      `,
      `select field1, field2 from data.arrayField where field1 = 42`,
      'SQL'
    )

    expect(JSON.parse(result as any)).toEqual([{ field1: 42, field2: 'foo' }])
  })
})
