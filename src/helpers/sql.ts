import lodash from 'lodash';
import { parse, nodes, Op } from 'sql-parser';
import { jsonParseSafe } from './json';

export const sqlEvaluation = (sourceString: string, queryString: string) => {
  try {
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

    const fieldNameMap = new Map<string, string>();
    if (sqlTree.fields[0].constructor !== nodes.Star) {
      sqlTree.fields.forEach((field: any) => {
        if (field.field && field.name) {
          fieldNameMap.set(field.field.value, field.name.value);
        }
      });
    }
    const fieldNameMapper = (_: any, key: string) =>
      fieldNameMap.has(key) ? fieldNameMap.get(key) : key;
    let tempValue = result.value();
    if (Array.isArray(tempValue)) {
      if (sqlTree.where && sqlTree.where.conditions) {
        tempValue = tempValue.filter(v => {
          const leftValue = sqlTree.where.conditions.left;
          const rightValue = sqlTree.where.conditions.right;
          const operation = sqlTree.where.conditions.operation;
          return compareOperands(operation, leftValue, rightValue, v);
        });
      }
      result = lodash.chain(tempValue).map(v => {
        let mapped = v;
        if (sqlTree.fields[0].constructor !== nodes.Star) {
          mapped = lodash.pick(
            v,
            sqlTree.fields.map((f: any) => f.field.value)
          );
        }

        mapped = lodash.mapKeys(mapped, fieldNameMapper);
        return mapped;
      });
    } else {
      if (sqlTree.fields[0].constructor !== nodes.Star) {
        result = result.pick(sqlTree.fields.map((f: any) => f.field.value));
      }
      result = result.mapKeys(fieldNameMapper);
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

  if (operation === '=' && value[lefty.value] === righty.value) {
    return true;
  }
  if (operation === '!=' && value[lefty.value] !== righty.value) {
    return true;
  }
  if (operation === '<>' && value[lefty.value] !== righty.value) {
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
