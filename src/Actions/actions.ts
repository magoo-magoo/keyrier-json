import { Theme } from '../Themes/themes'
import { QueryMode, tabType } from '../State/State'

export interface UpdateAutoFormatSource {
  type: 'UPDATE_AUTOFORMAT_SOURCE'
  active: boolean
}
export const updateAutoFormatSource = (active: boolean): UpdateAutoFormatSource => ({
  active,
  type: 'UPDATE_AUTOFORMAT_SOURCE',
})
export interface UpdateSource {
  type: 'UPDATE_SOURCE_TEXT'
  source: string
}
export const updateSource = (source: string): UpdateSource => ({
  source,
  type: 'UPDATE_SOURCE_TEXT',
})

export interface UpdateQueryAction {
  type: 'UPDATE_QUERY'
  query: string
}
export const updateQuery = (query: string): UpdateQueryAction => ({
  query,
  type: 'UPDATE_QUERY',
})

export interface ResetEditor {
  type: 'RESET_EDITOR'
}
export const resetEditor = (): ResetEditor => ({
  type: 'RESET_EDITOR',
})
export interface ClearEditor {
  type: 'CLEAR_EDITOR'
}
export const clearEditor = (): ClearEditor => ({
  type: 'CLEAR_EDITOR',
})
export interface EvaluateCode {
  type: 'EVALUATE_CODE'
}
export const evaluateCode = (): EvaluateCode => ({
  type: 'EVALUATE_CODE',
})

export interface ToggleOutputTableModal {
  type: 'TOGGLE_OUTPUT_TABLE_MODAL'
}
export const toggleOutputTableModal = (): ToggleOutputTableModal => ({
  type: 'TOGGLE_OUTPUT_TABLE_MODAL',
})

export interface UpdateTableColumns {
  type: 'UPDATE_TABLE_COLUMNS'
  columns: string[]
}
export const updateTableColumns = (columns: string[]): UpdateTableColumns => ({
  columns,
  type: 'UPDATE_TABLE_COLUMNS',
})
export interface UpdateTableGroupBy {
  type: 'UPDATE_TABLE_GROUP_BY'
  groupBy: string[]
}
export const updateTableGroupBy = (groupBy: string[]): UpdateTableGroupBy => ({
  groupBy,
  type: 'UPDATE_TABLE_GROUP_BY',
})

export interface SwitchTheme {
  type: 'SWITCH_GLOBAL_THEME'
  theme: Theme
}
export const switchTheme = (theme: Theme): SwitchTheme => ({
  theme,
  type: 'SWITCH_GLOBAL_THEME',
})

export interface UpdateSearchTerm {
  type: 'UPDATE_OUTPUT_SEARCH_TERM'
  searchTerm: string
}
export const updateSearchTerm = (searchTerm: string): UpdateSearchTerm => ({
  searchTerm,
  type: 'UPDATE_OUTPUT_SEARCH_TERM',
})
export interface UpdateQueryMode {
  type: 'UPDATE_QUERY_MODE'
  mode: QueryMode
}
export const updateQueryMode = (mode: QueryMode): UpdateQueryMode => ({
  mode,
  type: 'UPDATE_QUERY_MODE',
})

export interface UpdateOutputTabSelection {
  type: 'UPDATE_OUTPUT_TAB_SELECTION'
  tab: tabType
}
export const updateOutputTabSelection = (tab: tabType): UpdateOutputTabSelection => ({
  tab,
  type: 'UPDATE_OUTPUT_TAB_SELECTION',
})

export interface ReduxInitAction {
  type: '@@INIT'
}

export type Action =
  | Readonly<EvaluateCode>
  | Readonly<ResetEditor>
  | Readonly<ClearEditor>
  | Readonly<UpdateQueryAction>
  | Readonly<ToggleOutputTableModal>
  | Readonly<UpdateTableColumns>
  | Readonly<ReduxInitAction>
  | Readonly<UpdateTableGroupBy>
  | Readonly<SwitchTheme>
  | Readonly<UpdateSearchTerm>
  | Readonly<UpdateQueryMode>
  | Readonly<UpdateOutputTabSelection>
  | Readonly<UpdateSource>
  | Readonly<UpdateAutoFormatSource>
