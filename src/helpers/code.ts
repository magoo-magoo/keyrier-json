import { QueryMode } from '../State/State';
import { sqlEvaluation } from './sql';
import lodash from 'lodash';

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
