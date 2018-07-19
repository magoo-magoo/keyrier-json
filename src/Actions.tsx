/*
 * action types
 */
export const UPDATE_SOURCE = "UPDATE_SOURCE";
export const UPDATE_QUERY = "UPDATE_QUERY";
export const EVALUATE_CODE = "EVALUATE_CODE";
export const FORMAT_SOURCE_TEXT = "FORMAT_SOURCE_TEXT";

/*
 * action creators
 */

export const updateSource = (source: string) => ({
  text: source,
  type: UPDATE_SOURCE
});
export const formatSourceText = (source: string) => ({
  text: source,
  type: FORMAT_SOURCE_TEXT
});

export const updateQuery = (query: string) => ({
  text: query,
  type: UPDATE_QUERY
});
