import { computePath, sqlQuery, sqlQueryWithMultipleSources } from './sql'

describe('sql interpreter', () => {
    describe('projection', () => {
        it('should select sub object field', () => {
            const result = sqlQuery(
                `[{"child" : {
                        "foo": { "field" : "bar" }
                      }
            }
          ]`,
                'select child.foo.field from data'
            )

            expect(result).toEqual([{ field: 'bar' }])
        })

        it('should rename column whith As keyword correct column SQL query', () => {
            const result = sqlQuery(
                '{"age": 1, "name": "John Doe", "c": 999}',
                'select age, name as fullName from data'
            )
            expect(result).toEqual({ age: 1, fullName: 'John Doe' })
        })

        it('should rename column whith As keyword correct column when source is an array SQL query', () => {
            const result = sqlQuery(
                '[{"age": 1, "name": "John Doe", "c": 999}]',
                'select age, name as fullName from data'
            )

            expect(result).toEqual([{ age: 1, fullName: 'John Doe' }])
        })

        it('should return a simple object for select star from data SQL query', () => {
            const result = sqlQuery('{"a": 1, "b": 42}', 'select * from data')
            expect(result).toEqual({ a: 1, b: 42 })
        })

        it('should return a simple object for select with underscore from data SQL query', () => {
            const result = sqlQuery('{"_id": 1, "fo_o": 42}', 'select _id, fo_o from data')
            expect(result).toEqual({ _id: 1, fo_o: 42 })
        })

        it('should return a simple object for select star from string data SQL query', () => {
            const result = sqlQuery('{"a": 1, "b": 42}', 'select * from "data"')
            expect(result).toEqual({ a: 1, b: 42 })
        })

        it('should return a simple object for select string from data SQL query', () => {
            const result = sqlQuery(
                '{"a": 1, "b": 42, "c": 5}',
                'select "b", \'a\' , "b" as col, \'a\' as "col2" from data'
            )
            expect(result).toEqual({ a: 1, b: 42, col2: 1, col: 42 })
        })
        it('should return a simple object for select star and column name from data SQL query', () => {
            const result = sqlQuery('{"a": 1, "b": 42}', 'select *, a from data')
            expect(result).toEqual({ a: 1, b: 42 })
        })

        it('should select correct column SQL query', () => {
            const result = sqlQuery('{"a": 1, "b": 42, "c": 999}', 'select a, c from data')
            expect(result).toEqual({ a: 1, c: 999 })
        })

        it('should return sub object for select star from data.child SQL query', () => {
            const result = sqlQueryWithMultipleSources(
                { data: '{"a": 1, "b": 42, "child":[{"son":true}]}' },
                'select * from data.child'
            )
            expect(result).toEqual([{ son: true }])
        })

        it('should select correct column when source is an array', () => {
            const result = sqlQuery('[{"id": 1, "field": 42}, {"id": 2, "foo": "bar"}]', 'select id from data')
            expect(result).toEqual([{ id: 1 }, { id: 2 }])
        })
    })

    describe('from clause', () => {
        it('should select correct path for array field', () => {
            const result = sqlQuery(
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
                `select field1, field2 from data.arrayField`
            )

            expect(result).toEqual([
                { field1: 42, field2: 'foo' },
                { field1: 0, field2: 'bar' },
                {
                    field1: 66,
                    field2: 'test',
                },
            ])
        })
        it('should select correct path for array field with where clause', () => {
            const result = sqlQuery(
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
                `select field1, field2 from data.arrayField where field1 = 42`
            )

            expect(result).toEqual([{ field1: 42, field2: 'foo' }])
        })
        it('should return an error with bad SQL query - from missing', () => {
            const result = sqlQuery('{"a": 1}', 'select * data')
            expect(result).toBeInstanceOf(Error)
        })
        it('should return an error with bad SQL query - bad table', () => {
            const result = sqlQuery('{"a": 1}', 'select * from ddata')
            expect(result).toBeInstanceOf(Error)
        })

        it('should accept json as a source name', () => {
            const result = sqlQueryWithMultipleSources({ json: '{"a": 1}' }, 'select * from json')
            expect(result).not.toBeInstanceOf(Error)
        })

        it('should have a named table for plain object', () => {
            const result = sqlQueryWithMultipleSources(
                { data: '{"age": 1, "name": "John Doe", "c": 999}' },
                'select d.age, d.name as fullName from data d'
            )
            expect(result).toEqual({ age: 1, fullName: 'John Doe' })
        })

        it('should return result for table alias and without alias', () => {
            const result = sqlQueryWithMultipleSources(
                { data: '{"age": 1, "name": "John Doe", "c": 999}' },
                'select d.age, name from data d'
            )
            expect(result).toEqual({ age: 1, name: 'John Doe' })
        })
        it('should have a named table for array', () => {
            const result = sqlQueryWithMultipleSources(
                { data: '[{"age": 1, "name": "John Doe", "c": 999}]' },
                'select d.age, d.name as fullName from data d'
            )
            expect(result).toEqual([{ age: 1, fullName: 'John Doe' }])
        })
    })

    describe('where clause', () => {
        it('should return filtered results with deep where clause - SQL query', () => {
            const result = sqlQuery(
                '[{"id": 42, "child": {"foo": "bar"}},{"id": 666, "child": {"foo": "devil"}}]',
                "select id from data where child.foo = 'bar'"
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ id: 42 }])
        })

        it('should return filtered results with where clause -handle OR - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"},  {"age": 84, "name": "Macron Manu"}]',
                'select name as fullName from data where age = 42 or age = 21'
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'John Doe' }, { fullName: 'Danny de Vito' }])
        })

        it('should return all results with where clause -handle OR - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"},  {"age": 10, "name": "MacronManu"}]',
                "select name as fullName from data where age >= 21 or name = 'MacronManu'"
            )
            expect(result).toBeDefined()
            expect(result).toHaveLength(3)
        })
        it('should return all results with where clause -handle AND - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"},  {"age": 10, "name": "MacronManu"}]',
                'select name as fullName from data where age >= 10 and name is not null'
            )
            expect(result).toBeDefined()
            expect(result).toHaveLength(3)
        })

        it('should return no result with where clause -handle AND - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"},  {"age": 10, "name": "MacronManu"}]',
                'select name as fullName from data where age >= 10 and name is null'
            )
            expect(result).toBeDefined()
            expect(result).toHaveLength(0)
        })

        it('should return filtered results with where clause and string value with spaces -handle OR - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"},  {"age": 10, "name": "Macron Manu"}]',
                "select name as fullName from data where  name = 'Macron Manu'"
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'Macron Manu' }])
        })

        it('should return filtered results with where clause - in - SQL query', () => {
            const result = sqlQuery(
                '[{"id": 1, "field": 42}, {"id": 2, "foo": "bar"},  {"id": 3, "field": "value"}]',
                'select id from data where id in (1, 3)'
            )
            expect(result).toEqual([{ id: 1 }, { id: 3 }])
        })

        it('should return filtered results with where clause - in - SQL query', () => {
            const result = sqlQuery(
                '[{"id": 1, "field": 42}, {"id": 2, "foo": "bar"},  {"id": 3, "field": "value"}, {"id": "string-id"}]',
                'select id from data where id in (1, 3, "string-id")'
            )
            expect(result).toEqual([{ id: 1 }, { id: 3 }, { id: 'string-id' }])
        })

        it('should return filtered results with where clause - SQL query - is', () => {
            const result = sqlQuery(
                JSON.stringify([{ age: 42 }, { age: 21, v: null }]),
                'select * from data where v is null'
            )
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 21, v: null }])
        })

        it('should return no result with where clause - SQL query - is', () => {
            const result = sqlQuery(
                JSON.stringify([{ age: 42 }, { age: 21, foo: 'bonjour lol' }]),
                'select * from data where foo is "%lol%"'
            )
            expect(result).not.toBeNull()

            expect(result).toEqual([])
        })

        it('should return filtered results with where clause - SQL query - is not', () => {
            const result = sqlQuery(
                JSON.stringify([
                    { age: 42, v: {} },
                    { age: 21, v: null },
                ]),
                'select age from data where v is not null'
            )
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 42 }])
        })

        it('should return filtered results with where clause- like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select name as fullName from data where name like "Joh%"'
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'John Doe' }])
        })

        it('should return filtered results with where clause- like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select name as fullName from data where name like "%y%"'
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'Danny de Vito' }])
        })
        it('should return filtered results with where clause- like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select name as fullName from data where name like "%ohn%"'
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'John Doe' }])
        })

        it('should return filtered results with where clause- like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select name as fullName from data where name like "%oe"'
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'John Doe' }])
        })

        it('should return no result with where clause- like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select name as fullName from data where name like 42'
            )
            expect(result).toEqual([])
        })
        it('should return result with where clause- not like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select * from data where name not like "Joh%"'
            )
            expect(result).toEqual([{ age: 21, name: 'Danny de Vito' }])
        })

        it('should return result with where clause- not like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select * from data where name not like "%Doe"'
            )
            expect(result).toEqual([{ age: 21, name: 'Danny de Vito' }])
        })

        it('should apply function lower', () => {
            const result = sqlQuery('[{"name": "John Doe"}, {"name": "Danny de Vito"}]', 'select lower(name) from data')
            expect(result).toEqual([{ 'lower(name)': 'john doe' }, { 'lower(name)': 'danny de vito' }])
        })
        it('should apply function upper', () => {
            const result = sqlQuery('[{"name": "John Doe"}]', 'select upper(name) from data')
            expect(result).toEqual([{ 'upper(name)': 'JOHN DOE' }])
        })
        it('should apply function length', () => {
            const result = sqlQuery('[{"name": "toto"}]', 'select length(name) from data')
            expect(result).toEqual([{ 'length(name)': 4 }])
        })

        it('should apply function len', () => {
            const result = sqlQuery('[{"foo": "Paris"}]', 'select len(foo) from data')
            expect(result).toEqual([{ 'len(foo)': 5 }])
        })

        it('should apply function len and display alias', () => {
            const result = sqlQuery('[{"foo": "Paris"}]', 'select len(foo) as longueur from data')
            expect(result).toEqual([{ longueur: 5 }])
        })

        it('should apply function reverse', () => {
            const result = sqlQuery('[{"foo": "Paris"}]', 'select reverse(foo) from data')
            expect(result).toEqual([{ 'reverse(foo)': 'siraP' }])
        })

        it('should apply function trim', () => {
            const result = sqlQuery('[{"foo": "   Paris   "}]', 'select trim(foo) from data')
            expect(result).toEqual([{ 'trim(foo)': 'Paris' }])
        })

        it('should apply function trimleft', () => {
            const result = sqlQuery('[{"foo": "   Paris   "}]', 'select trimlefT(foo) from data')
            expect(result).toEqual([{ 'trimlefT(foo)': 'Paris   ' }])
        })

        it('should apply function trimright', () => {
            const result = sqlQuery('[{"foo": "   Paris   "}]', 'select trimRight(foo) from data')
            expect(result).toEqual([{ 'trimRight(foo)': '   Paris' }])
        })

        it('should return result with where clause- not like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select * from data where name not like "% Do%"'
            )
            expect(result).toEqual([{ age: 21, name: 'Danny de Vito' }])
        })
        it('should return no result with where clause- not like operator - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select * from data where name not like "D"'
            )
            expect(result).toEqual([
                { age: 42, name: 'John Doe' },
                { age: 21, name: 'Danny de Vito' },
            ])
        })

        it('should return filtered results with where clause - SQL query', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select name as fullName from data where age = 42'
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'John Doe' }])
        })

        it('should return filtered results with where clause - SQL query - =', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age = 42')
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 42 }])
        })
        it('should return filtered results with where clause - SQL query - !=', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age != 42')
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 21 }])
        })

        it('should return filtered results with where clause - SQL query - <>', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age <> 42')
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 21 }])
        })

        it('should return filtered results with where clause - SQL query - >', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age > 41')
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 42 }])
        })

        it('should return no result with where clause - SQL query - >', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age > 42')
            expect(result).not.toBeNull()

            expect(result).toEqual([])
        })
        it('should return no result with where clause - SQL query - <', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age < 21')
            expect(result).not.toBeNull()

            expect(result).toEqual([])
        })

        it('should return filtered results with where clause - SQL query - >', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age > null')
            expect(result).not.toBeNull()

            expect(result).toEqual([])
        })

        it('should return filtered results with where clause - SQL query - >=', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age >= 42')
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 42 }])
        })

        it('should return filtered results with where clause - SQL query - <', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age < 41')
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 21 }])
        })
        it('should return filtered results with where clause - SQL query - <=', () => {
            const result = sqlQuery(JSON.stringify([{ age: 42 }, { age: 21 }]), 'select * from data where age <= 21')
            expect(result).not.toBeNull()

            expect(result).toEqual([{ age: 21 }])
        })
    })

    describe('limit', () => {
        it('should return 2 items array when limit is 2', () => {
            const result = sqlQuery(
                '[{"id": 1, "field": 42}, {"id": 2, "foo": "bar"},  {"id": 3, "field": "value"}]',
                'select id from data limit 2'
            )
            expect(result).toEqual([{ id: 1 }, { id: 2 }])
        })
    })

    describe('Comments', () => {
        it('should ignore comments', () => {
            const result = sqlQuery(
                '{"a": 1, "b": 42}',
                `
        
        -- Commentaire
        --IGNORE ME
        
        select * from data
        --IGNORE ME
        
        --IGNORE ME`
            )
            expect(result).toEqual({ a: 1, b: 42 })
        })
    })
    describe('order by', () => {
        it('should order by age', () => {
            const result = sqlQuery(
                '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
                'select name as fullName from data order by age'
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'Danny de Vito' }, { fullName: 'John Doe' }])
        })
        it('should order by age desc', () => {
            const result = sqlQueryWithMultipleSources(
                { data: '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]' },
                'select name as fullName from data order by age desc'
            )
            expect(result).toBeDefined()
            expect(result).toEqual([{ fullName: 'John Doe' }, { fullName: 'Danny de Vito' }])
        })
    })

    describe('mutliple sources', () => {
        it('should query object', () => {
            const result = sqlQueryWithMultipleSources(
                { data1: '[{"a": 1, "b": 42}, {"a": "foo", "b": 42}]', data2: '[{"toto": "xxx"}, {"toto": "foo"}]' },
                'select a from data1 where a in (select toto from data2)'
            )
            expect(result).toEqual([{ a: 'foo' }])
        })
    })

    describe('path', () => {
        it.each`
            path                               | expected
            ${null}                            | ${[]}
            ${undefined}                       | ${[]}
            ${[]}                              | ${[]}
            ${['field']}                       | ${['field']}
            ${['data', 'field']}               | ${['field']}
            ${['child', 'value', 'something']} | ${['child', 'value', 'something']}
        `('returns $expected when given path is $path', ({ path, expected }) => {
            const result = computePath(path)
            expect(result).toEqual(expected)
        })
    })
})
