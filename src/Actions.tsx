/*
 * action types
 */
export type UPDATE_SOURCE = "UPDATE_SOURCE";
export type UPDATE_QUERY = "UPDATE_QUERY";
export type EVALUATE_CODE = "EVALUATE_CODE";
export type FORMAT_SOURCE_TEXT = "FORMAT_SOURCE_TEXT";

/*
 * action creators
 */

export const updateSource = (source: string): IActionResultValue<string> => ({
  text: source,
  type: "UPDATE_SOURCE"
});
export const formatSourceText = (source: string): IActionResult => ({
  type: "FORMAT_SOURCE_TEXT"
});

export const updateQuery = (query: string): IActionResultValue<string> => ({
  text: query,
  type: "UPDATE_QUERY"
});

export interface IActionResultValue<T> {
  text: T;
  type: actionType;
}

export interface IActionResult {
  type: actionType;
}

export type Action = IActionResult | IActionResultValue<string>;

type actionType =
  | UPDATE_SOURCE
  | UPDATE_QUERY
  | EVALUATE_CODE
  | FORMAT_SOURCE_TEXT;
