import { QueryMode, tabType } from 'state/State'
import { GeneralTheme, EditorTheme } from 'themes/themes'

export const updateAutoFormatSource = (active: boolean) =>
  ({
    active,
    type: 'UPDATE_AUTOFORMAT_SOURCE',
  } as const)

export const updateSource = (source: string) =>
  ({
    source,
    type: 'UPDATE_SOURCE_TEXT',
  } as const)

export const updateQuery = (query: string) =>
  ({
    query,
    type: 'UPDATE_QUERY',
  } as const)

export const resetEditor = () =>
  ({
    type: 'RESET_EDITOR',
  } as const)

export const clearEditor = () =>
  ({
    type: 'CLEAR_EDITOR',
  } as const)

export const evaluateCode = () =>
  ({
    type: 'EVALUATE_CODE',
  } as const)

export const toggleOutputTableModal = () =>
  ({
    type: 'TOGGLE_OUTPUT_TABLE_MODAL',
  } as const)

export const updateTableColumns = (columns: string[]) =>
  ({
    columns,
    type: 'UPDATE_TABLE_COLUMNS',
  } as const)

export const updateTableGroupBy = (groupBy: string[]) =>
  ({
    groupBy,
    type: 'UPDATE_TABLE_GROUP_BY',
  } as const)

export const switchTheme = (theme: GeneralTheme) => ({
  theme,
  type: 'SWITCH_GLOBAL_THEME' as const,
})

export const switchEditorTheme = (theme: EditorTheme) => ({
  theme,
  type: 'SWITCH_EDITOR_THEME' as const,
})

export const updateSearchTerm = (searchTerm: string) =>
  ({
    searchTerm,
    type: 'UPDATE_OUTPUT_SEARCH_TERM',
  } as const)

export const updateQueryMode = (mode: QueryMode) =>
  ({
    mode,
    type: 'UPDATE_QUERY_MODE',
  } as const)

export const updateOutputTabSelection = (tab: tabType) =>
  ({
    tab,
    type: 'UPDATE_OUTPUT_TAB_SELECTION',
  } as const)

type ReduxInitAction = {
  type: '@@INIT'
}

export type Action =
  | Readonly<ReduxInitAction>
  | ReturnType<typeof evaluateCode>
  | ReturnType<typeof resetEditor>
  | ReturnType<typeof clearEditor>
  | ReturnType<typeof updateQuery>
  | ReturnType<typeof toggleOutputTableModal>
  | ReturnType<typeof updateTableColumns>
  | ReturnType<typeof updateTableGroupBy>
  | ReturnType<typeof switchTheme>
  | ReturnType<typeof updateSearchTerm>
  | ReturnType<typeof updateQueryMode>
  | ReturnType<typeof updateOutputTabSelection>
  | ReturnType<typeof updateSource>
  | ReturnType<typeof updateAutoFormatSource>
  | ReturnType<typeof switchEditorTheme>
