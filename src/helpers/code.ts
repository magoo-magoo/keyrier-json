import { QueryMode } from '../State/State';
import { nodes, parse, Op } from 'sql-parser';
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

const sqlEvaluation = (sourceString: string, queryString: string) => {
  try {
    if (!lodash) {
      return new Error('lodash is missing');
    }
    const sqlTree = parse(queryString);

    if (sqlTree.source.name.values[0] !== 'data') {
      return new Error(`${sqlTree.source.name.values[0]} table does not exist`);
    }

    let fromPath: string[] = [];

    if (sqlTree.source.name.values && sqlTree.source.name.values.length > 1) {
      if (sqlTree.source.name.values[0] === 'data') {
        fromPath = [...sqlTree.source.name.values];
        fromPath.shift();
      }
    }

    let result = lodash.chain(jsonParseSafe(sourceString));

    if (fromPath && fromPath.length > 0) {
      result = result.get(fromPath);
    }

    if (sqlTree.fields[0].constructor !== nodes.Star) {
      const fieldNameMap = new Map<string, string>();
      sqlTree.fields.forEach((field: any) => {
        if (field.field && field.name)
          fieldNameMap.set(field.field.value, field.name.value);
      });
      const fieldNameMapper = (_value: any, key: string) =>
        fieldNameMap.has(key) ? fieldNameMap.get(key) : key;

      let tempValue = result.value();
      if (Array.isArray(tempValue) && lodash) {
        if (sqlTree.where && sqlTree.where.conditions) {
          tempValue = tempValue.filter(v => {
            const leftValue = sqlTree.where.conditions.left;
            const rightValue = sqlTree.where.conditions.right;
            const operation = sqlTree.where.conditions.operation;
            debugger;
            return compareOperands(operation, leftValue, rightValue, v);
          });
        }
        result = lodash.chain(tempValue).map(v => {
          if (!lodash) {
            return {};
          }
          let mapped = lodash.pick(
            v,
            sqlTree.fields.map((f: any) => f.field.value)
          );
          mapped = lodash.mapKeys(mapped, fieldNameMapper);
          return mapped;
        });
      } else if (lodash) {
        result = result.pick(sqlTree.fields.map((f: any) => f.field.value));
        result = result.mapKeys(fieldNameMapper);
      }
    }

    const resultValue = result.value();

    return JSON.stringify(resultValue);
  } catch (e) {
    return e;
  }
};

const compareOperands = (
  operation: string | null,
  lefty: Op,
  righty: Op,
  value: any
): boolean => {
  if (operation) {
    if (operation.toLowerCase() === 'or') {
      return (
        compareOperands(lefty.operation, lefty.left, lefty.right, value) ||
        compareOperands(righty.operation, righty.left, righty.right, value)
      );
    }

    if (operation.toLowerCase() === 'and') {
      return (
        compareOperands(lefty.operation, lefty.left, lefty.right, value) &&
        compareOperands(righty.operation, righty.left, righty.right, value)
      );
    }
  }

  if (!lefty.value) {
    return false;
  }

  if (operation === '=' && value[lefty.value] == righty.value) {
    return true;
  }
  if (operation === '!=' && value[lefty.value] != righty.value) {
    return true;
  }
  if (operation === '<>' && value[lefty.value] != righty.value) {
    return true;
  }

  if (righty.value) {
    if (operation === '>' && value[lefty.value] > righty.value) {
      return true;
    }
    if (operation === '>=' && value[lefty.value] >= righty.value) {
      return true;
    }
    if (operation === '<' && value[lefty.value] < righty.value) {
      return true;
    }
    if (operation === '<=' && value[lefty.value] <= righty.value) {
      return true;
    }
  }

  return false;
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
