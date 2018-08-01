import lodash from "lodash";

export const codeEvaluation = (
  sourceString: string,
  queryString: string,
): string | null | Error => {
  if (!sourceString || sourceString.trim() === "") {
    return null;
  }

  if (!queryString || queryString.trim() === "") {
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
    if (type !== "string") {
      return null;
    }
    return evaluatedQuery as string;
  } catch (error) {
    return error;
  } finally {
    (window as any)._ = undefined;
  }
};
