import { codeEvaluation } from "./code";

describe("code helpers", () => {

  beforeAll(async()=> {
     (window as any)._ = await import(/* webpackChunkName: "lodash" */ "lodash");
  })

  it("should eval simple object", () => {
    const result = codeEvaluation('{"a": 1}', 'data.a');
    expect(result).toEqual('1');
  });

  it("should eval empty array", () => {
    const result = codeEvaluation('[]', 'data');
    expect(result).toEqual('[]');
  });

  it("should returns an error with bad code", () => {
    const result = codeEvaluation('{"a": 1}', 'data.');
    expect(result).toBeInstanceOf(Error);
  });

  it("should eval code with lodash", () => {
    const result = codeEvaluation('{"results": [{"val": 42, "notMapped": "toto"}]}', `
    _.chain(data)
    .get('results')
    .map(d => _.pick(d, ['val' ]))
    
    `);
    expect(result).toBe('[{"val":42}]');
  });

});
