import { codeEvaluation } from './code'
import { computePath } from './sql'

describe('sql interpreter', () => {
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

    it('should returns filtered results with where clause - SQL query - =', () => {
        const result = codeEvaluation(
            JSON.stringify([{ age: 42 }, { age: 21 }]),
            'select * from data where age = 42',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 42 }])
    })
    it('should returns filtered results with where clause - SQL query - !=', () => {
        const result = codeEvaluation(
            JSON.stringify([{ age: 42 }, { age: 21 }]),
            'select * from data where age != 42',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 21 }])
    })

    it('should returns filtered results with where clause - SQL query - <>', () => {
        const result = codeEvaluation(
            JSON.stringify([{ age: 42 }, { age: 21 }]),
            'select * from data where age <> 42',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 21 }])
    })

    it('should returns filtered results with where clause - SQL query - >', () => {
        const result = codeEvaluation(
            JSON.stringify([{ age: 42 }, { age: 21 }]),
            'select * from data where age > 41',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 42 }])
    })

    it('should returns filtered results with where clause - SQL query - >=', () => {
        const result = codeEvaluation(
            JSON.stringify([{ age: 42 }, { age: 21 }]),
            'select * from data where age >= 42',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 42 }])
    })

    it('should returns filtered results with where clause - SQL query - <', () => {
        const result = codeEvaluation(
            JSON.stringify([{ age: 42 }, { age: 21 }]),
            'select * from data where age < 41',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 21 }])
    })
    it('should returns filtered results with where clause - SQL query - <=', () => {
        const result = codeEvaluation(
            JSON.stringify([{ age: 42 }, { age: 21 }]),
            'select * from data where age <= 21',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 21 }])
    })
    it('should returns filtered results with where clause - SQL query - is', () => {
        const result = codeEvaluation(
            JSON.stringify([{ age: 42 }, { age: 21, v: null }]),
            'select * from data where v is null',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 21, v: null }])
    })

    it('should returns filtered results with where clause - SQL query - is not', () => {
        const result = codeEvaluation(
            JSON.stringify([
                { age: 42, v: {} },
                { age: 21, v: null },
            ]),
            'select age from data where v is not null',
            'SQL'
        )
        expect(result).not.toBeNull()

        expect(JSON.parse(result as any)).toEqual([{ age: 42 }])
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

    it('should have a named table for plain object', () => {
        const result = codeEvaluation(
            '{"age": 1, "name": "John Doe", "c": 999}',
            'select d.age, d.name as fullName from data d',
            'SQL'
        )
        expect(JSON.parse(result as any)).toEqual({ age: 1, fullName: 'John Doe' })
    })
    it('should have a named table for array', () => {
        const result = codeEvaluation(
            '[{"age": 1, "name": "John Doe", "c": 999}]',
            'select d.age, d.name as fullName from data d',
            'SQL'
        )
        expect(JSON.parse(result as any)).toEqual([{ age: 1, fullName: 'John Doe' }])
    })

    it('should ignore comments', () => {
        const result = codeEvaluation(
            '{"a": 1, "b": 42}',
            `
    
    -- Commentaire
    --IGNORE ME
    
    select * from data
    --IGNORE ME
    
    --IGNORE ME`,

            'SQL'
        )
        expect(JSON.parse(result as any)).toEqual({ a: 1, b: 42 })
    })

    it('should order by age', () => {
        const result = codeEvaluation(
            '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
            'select name as fullName from data order by age',
            'SQL'
        )
        expect(result).toBeDefined()
        expect(JSON.parse(result as any)).toEqual([{ fullName: 'Danny de Vito' }, { fullName: 'John Doe' }])
    })
    it('should order by age desc', () => {
        const result = codeEvaluation(
            '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
            'select name as fullName from data order by age desc',
            'SQL'
        )
        expect(result).toBeDefined()
        expect(JSON.parse(result as any)).toEqual([{ fullName: 'John Doe' }, { fullName: 'Danny de Vito' }])
    })
})
function ddd(result: string | Error | null) {
    if (typeof result !== 'string') {
        throw new Error()
    }
}
