/*
 * action creators
 */
export interface IUpdateSource {
  type: "UPDATE_SOURCE_TEXT";
  source: string;
}
export const updateSource = (source: string): IUpdateSource => ({
  source,
  type: "UPDATE_SOURCE_TEXT",
});

export interface IUpdateQueryAction {
  type: "UPDATE_QUERY";
  query: string;
}
export const updateQuery = (query: string): IUpdateQueryAction => ({
  query,
  type: "UPDATE_QUERY"
});

export interface IResetEditor {
  type: "RESET_EDITOR";
}
export const resetEditor = (): IResetEditor => ({
  type: "RESET_EDITOR"
});
export interface IEvaluateCode {
  type: "EVALUATE_CODE";
}
export const evaluateCode = (): IEvaluateCode => ({
  type: "EVALUATE_CODE"
});

export let a: Action = { type: "EVALUATE_CODE" };

export type Action =
  | Readonly<IEvaluateCode>
  | Readonly<IResetEditor>
  | Readonly<IUpdateQueryAction>
  | Readonly<IUpdateSource>;
