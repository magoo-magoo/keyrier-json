import { codeEvaluation } from './code';

describe('code helpers', () => {
  beforeAll(async () => {
    (window as any)._ = await import(/* webpackChunkName: "lodash" */ 'lodash');
  });

  it('should eval simple object', () => {
    const result = codeEvaluation('{"a": 1}', 'data.a', 'Javascript');
    expect(result).toEqual('1');
  });

  it('should eval empty array', () => {
    const result = codeEvaluation('[]', 'data', 'Javascript');
    expect(result).toEqual('[]');
  });

  it('should returns an error with bad code', () => {
    const result = codeEvaluation('{"a": 1}', 'data.', 'Javascript');
    expect(result).toBeInstanceOf(Error);
  });

  it('should eval code with lodash', () => {
    const result = codeEvaluation(
      '{"results": [{"val": 42, "notMapped": "toto"}]}',
      `
    _.chain(data)
    .get('results')
    .map(d => _.pick(d, ['val' ]))
    
    `,
      'Javascript'
    );
    expect(result).toBe('[{"val":42}]');
  });

  it('should returns an error with bad SQL query - from missing', () => {
    const result = codeEvaluation('{"a": 1}', 'select * data', 'SQL');
    expect(result).toBeInstanceOf(Error);
  });
  it('should returns an error with bad SQL query - bad table', () => {
    const result = codeEvaluation('{"a": 1}', 'select * from ddata', 'SQL');
    expect(result).toBeInstanceOf(Error);
  });

  it('should returns a simple object for `select * from data` SQL query', () => {
    const result = codeEvaluation(
      '{"a": 1, "b": 42}',
      'select * from data',
      'SQL'
    );
    expect(JSON.parse(result as any)).toEqual({ a: 1, b: 42 });
  });

  it('should select correct column SQL query', () => {
    const result = codeEvaluation(
      '{"a": 1, "b": 42, "c": 999}',
      'select a, c from data',
      'SQL'
    );
    expect(JSON.parse(result as any)).toEqual({ a: 1, c: 999 });
  });

  it('should returns sub object for `select * from data.child` SQL query', () => {
    const result = codeEvaluation(
      '{"a": 1, "b": 42, "child":[{"son":true}]}',
      'select * from data.child',
      'SQL'
    );
    expect(JSON.parse(result as any)).toEqual([{ son: true }]);
  });

  it('should select correct column when source is an array', () => {
    const result = codeEvaluation(
      '[{"id": 1, "field": 42}, {"id": 2, "foo": "bar"}]',
      'select id from data',
      'SQL'
    );
    expect(JSON.parse(result as any)).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('should rename column whith As keyword correct column SQL query', () => {
    const result = codeEvaluation(
      '{"age": 1, "name": "John Doe", "c": 999}',
      'select age, name as fullName from data',
      'SQL'
    );
    expect(JSON.parse(result as any)).toEqual({ age: 1, fullName: 'John Doe' });
  });

  it('should rename column whith As keyword correct column when source is an array SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 1, "name": "John Doe", "c": 999}]',
      'select age, name as fullName from data',
      'SQL'
    );

    expect(JSON.parse(result as any)).toEqual([
      { age: 1, fullName: 'John Doe' },
    ]);
  });

  it('should returns filtered results with where clause - SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"}]',
      'select name as fullName from data where age = 42',
      'SQL'
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result as any)).toEqual([{ fullName: 'John Doe' }]);
  });
  it('should returns filtered results with where clause -handle OR - SQL query', () => {
    const result = codeEvaluation(
      '[{"age": 42, "name": "John Doe"}, {"age": 21, "name": "Danny de Vito"},  {"age": 84, "name": "Macron Manu"}]',
      'select name as fullName from data where age = 42 or age = 21',
      'SQL'
    );
    expect(result).toBeDefined();
    expect(JSON.parse(result as any)).toEqual([
      { fullName: 'John Doe' },
      { fullName: 'Danny de Vito' },
    ]);
  });
});
