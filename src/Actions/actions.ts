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

export interface ToggleOutputTableModal {
  type: "TOGGLE_OUTPUT_TABLE_MODAL";
}
export const toggleOutputTableModal = (): ToggleOutputTableModal => ({
  type: "TOGGLE_OUTPUT_TABLE_MODAL"
});

export interface UpdateTableColumns {
  type: "UPDATE_TABLE_COLUMNS";
  columns: string[];
}
export const updateTableColumns = (columns: string[]): UpdateTableColumns => ({
  columns,
  type: "UPDATE_TABLE_COLUMNS"
});
export interface UpdateTableGroupBy {
  type: "UPDATE_TABLE_GROUP_BY";
  groupBy: string[];
}
export const updateTableGroupBy = (groupBy: string[]): UpdateTableGroupBy => ({
  groupBy,
  type: "UPDATE_TABLE_GROUP_BY"
});

export interface ReduxInitAction {
  type: "@@INIT";
}

export type Action =
  | Readonly<EvaluateCode>
  | Readonly<ResetEditor>
  | Readonly<UpdateQueryAction>
  | Readonly<ToggleOutputTableModal>
  | Readonly<UpdateTableColumns>
  | Readonly<ReduxInitAction>
  | Readonly<UpdateTableGroupBy>
  | Readonly<UpdateSource>;
