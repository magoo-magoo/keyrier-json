import { customToString } from './string';

describe('string helpers', () => {
  it('should convert number', () => {
    const result = customToString(42);
    expect(result).toBe('42');
  });

  it('should convert string', () => {
    const result = customToString('toto');
    expect(result).toBe('toto');
  });
  it('should convert falsy boolean', () => {
    const result = customToString(false);
    expect(result).toBe('false');
  });
  it('should convert thruthy boolean', () => {
    const result = customToString(true);
    expect(result).toBe('true');
  });

  it('should convert empty array', () => {
    const result = customToString([]);
    expect(result).toBe('');
  });
  it('should convert populated array', () => {
    const result = customToString(['Hello', 'World']);
    expect(result).toBe('Hello,World');
  });
  it('should convert object', () => {
    const result = customToString({ property: 42 });
    expect(result).toBe('{"property":42}');
  });
});
