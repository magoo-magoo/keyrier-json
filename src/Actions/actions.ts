/*
 * action creators
 */
export interface UpdateSource {
  type: "UPDATE_SOURCE_TEXT";
  source: string;
}
export const updateSource = (source: string): UpdateSource => ({
  source,
  type: "UPDATE_SOURCE_TEXT"
});

export interface UpdateQueryAction {
  type: "UPDATE_QUERY";
  query: string;
}
export const updateQuery = (query: string): UpdateQueryAction => ({
  query,
  type: "UPDATE_QUERY"
});

export interface ResetEditor {
  type: "RESET_EDITOR";
}
export const resetEditor = (): ResetEditor => ({
  type: "RESET_EDITOR"
});
export interface EvaluateCode {
  type: "EVALUATE_CODE";
}
export const evaluateCode = (): EvaluateCode => ({
  type: "EVALUATE_CODE"
});

export let a: Action = { type: "EVALUATE_CODE" };

export type Action =
  | Readonly<EvaluateCode>
  | Readonly<ResetEditor>
  | Readonly<UpdateQueryAction>
  | Readonly<UpdateSource>;
