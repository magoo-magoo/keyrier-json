import { createAction } from '@reduxjs/toolkit'
import { QueryMode, tabType } from 'state/State'
import { EditorTheme, GeneralTheme } from 'themes/themes'

const Actions = {
    resetEditor: createAction('RESET_EDITOR'),
    clearEditor: createAction('CLEAR_EDITOR'),
    updateSource: createAction<string, 'UPDATE_SOURCE_TEXT'>('UPDATE_SOURCE_TEXT'),
    updateAutoFormatSource: createAction<boolean, 'UPDATE_AUTOFORMAT_SOURCE'>('UPDATE_AUTOFORMAT_SOURCE'),
    updateQueryMode: createAction<QueryMode, 'UPDATE_QUERY_MODE'>('UPDATE_QUERY_MODE'),
    updateQuery: createAction<string, 'UPDATE_QUERY'>('UPDATE_QUERY'),
    updateOutputTabSelection: createAction<tabType, 'UPDATE_OUTPUT_TAB_SELECTION'>('UPDATE_OUTPUT_TAB_SELECTION'),
    toggleOutputTableModal: createAction('TOGGLE_OUTPUT_TABLE_MODAL'),
    updateTableColumns: createAction<string[], 'UPDATE_TABLE_COLUMNS'>('UPDATE_TABLE_COLUMNS'),
    updateTableGroupBy: createAction<string[], 'UPDATE_TABLE_GROUP_BY'>('UPDATE_TABLE_GROUP_BY'),
    updateSearchTerm: createAction<string, 'UPDATE_OUTPUT_SEARCH_TERM'>('UPDATE_OUTPUT_SEARCH_TERM'),
    undo: createAction('APP_UNDO'),
    redo: createAction('APP_REDO'),
    switchTheme: createAction<GeneralTheme, '@USER_SETTINGS/SWITCH_GLOBAL_THEME'>('@USER_SETTINGS/SWITCH_GLOBAL_THEME'),
    switchEditorTheme: createAction<EditorTheme, '@USER_SETTINGS/SWITCH_EDITOR_THEME'>(
        '@USER_SETTINGS/SWITCH_EDITOR_THEME'
    ),
    updateLayouts: createAction<ReactGridLayout.Layouts, '@USER_SETTINGS/UPDATE_LAYOUTS'>(
        '@USER_SETTINGS/UPDATE_LAYOUTS'
    ),
}

export type Action = ReturnType<typeof Actions[keyof typeof Actions]>

export default Actions
