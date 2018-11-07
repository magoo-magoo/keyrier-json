import { jsonParseSafe, jsonBeautify } from './json';

describe('json helpers', () => {
  it('should parse simple object', () => {
    const result = jsonParseSafe('{"a": 1}');
    expect(result).toEqual({ a: 1 });
  });
  it('should parse empty object', () => {
    const result = jsonParseSafe('{}');
    expect(result).toEqual({});
  });

  it('should parse wrong format', () => {
    const result = jsonParseSafe('{wrong JSON}');
    expect(result).toEqual('{wrong JSON}');
  });
  it('should parse empty', () => {
    const result = jsonParseSafe('');
    expect(result).toBeNull();
  });
  it('should parse null', () => {
    const result = jsonParseSafe(null as any);
    expect(result).toBeNull();
  });
  it('should parse undefined', () => {
    const result = jsonParseSafe(undefined as any);
    expect(result).toBeNull();
  });
  it('should parse undefined', () => {
    const result = jsonParseSafe(undefined as any);
    expect(result).toBeNull();
  });
  it('should parse json string with special character', () => {
    const result = jsonParseSafe(`
    {
          "x" : "Hello"      ,
        "1" :"World",
        "foo" : ""

    }
    `);
    expect(result).toEqual({ x: 'Hello', '1': 'World', foo: '' });
  });

  it('jsonBeautify should not change semantic', () => {
    const result = jsonBeautify(`{   "field1":   "Value1",
    "field2": "Value2",
    
    "field3"             : 3    }`);

    expect(JSON.parse(result)).toEqual({
      field1: 'Value1',
      field2: 'Value2',
      field3: 3,
    });
  });
  it('jsonBeautify should returns string', () => {
    const result = jsonBeautify(`toto`);

    expect(result).toEqual('toto');
  });
});
