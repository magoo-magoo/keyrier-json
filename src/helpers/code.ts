import { QueryMode } from '../State/State';
import { lexer, parser, nodes } from 'sql-parser';
import { jsonParseSafe } from './json';

let lodash: _.LoDashStatic | null = null;
import(/* webpackChunkName: "lodash" */ 'lodash').then(module => {
  lodash = module.default;
});

export const codeEvaluation = (
  sourceString: string,
  queryString: string,
  mode: QueryMode
): string | null | Error => {
  if (mode === 'Javascript') {
    return jsEvaluation(sourceString, queryString);
  } else if (mode === 'SQL') {
    return sqlEvaluation(sourceString, queryString);
  }

  return new Error('unsupported mode');
};

const sqlEvaluation = (_sourceString: string, queryString: string) => {
  try {
    if (!lodash) {
      return new Error('lodash is missing');
    }
    const tokens = lexer.tokenize(queryString);
    const parsed = parser.parse(tokens);

    if (parsed.source.name.values[0] !== 'data') {
      return new Error(`${parsed.source.name.values[0]} table does not exist`);
    }

    let fromPath = [];

    if (parsed.source.name.values && parsed.source.name.values.length > 1) {
      if (parsed.source.name.values[0] === 'data') {
        fromPath = [...parsed.source.name.values];
        fromPath.shift();
      }
    }

    let result = lodash.chain(jsonParseSafe(_sourceString));

    if (fromPath && fromPath.length > 0) {
      result = result.get(fromPath);
    }

    if (parsed.fields[0].constructor !== nodes.Star)
      result = result.pick(parsed.fields.map((f: any) => f.field.value));

    const resultValue = result.value();

    return JSON.stringify(resultValue);
  } catch (e) {
    return e;
  }
};

const jsEvaluation = (sourceString: string, queryString: string) => {
  if (!sourceString || sourceString.trim() === '') {
    return null;
  }

  if (!queryString || queryString.trim() === '') {
    return null;
  }

  try {
    (window as any)._ = lodash;
    const code = `
      
        const data = eval(${sourceString})
        JSON.stringify(${queryString})
      `;
    const evaluatedQuery = eval.apply(null, [code]); // DANGEROUS
    const type = typeof evaluatedQuery;
    if (type !== 'string') {
      return null;
    }
    return evaluatedQuery as string;
  } catch (error) {
    return error;
  } finally {
    (window as any)._ = undefined;
  }
};
