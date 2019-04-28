import { RootState } from 'state/State'

export const getOutputErrorMessage = (state: RootState) =>
  state && state.app && state.app.present.output ? state.app.present.output.errorMessage : ''

export const getOutputIsArray = (state: RootState) =>
  state && state.app && state.app.present.output && state.app.present.output.table
    ? !!state.app.present.output.table.isArray
    : false
export const getOutputActiveTab = (state: RootState) =>
  state && state.app && state.app.present.output && state.app.present.output.selectedTab
    ? state.app.present.output.selectedTab
    : ('RawJson' as const)
export const getOutputObject = (state: RootState) =>
  state && state.app && state.app.present.output && state.app.present.output.obj ? state.app.present.output.obj : {}
export const getOutputObjectSize = (state: RootState) =>
  state && state.app && state.app.present.output && state.app.present.output.objSize
    ? state.app.present.output.objSize
    : 0
export const getOutputSearchTerm = (state: RootState) =>
  state && state.app && state.app.present.output && state.app.present.output.searchTerm
export const getOutputSearchMatch = (state: RootState) =>
  state && state.app && state.app.present.output ? !!state.app.present.output.match : false
export const getisOutputTableModalOpen = (state: RootState) =>
  state && state.app && state.app.present.output && state.app.present.output.table
    ? !!state.app.present.output.table.isModalOpen
    : false

export const getTheme = (state: RootState) =>
  state.userSettings && state.userSettings.globalTheme ? state.userSettings.globalTheme : ('pulse' as const)
export const getEditorTheme = (state: RootState) =>
  state.userSettings && state.userSettings.editorTheme ? state.userSettings.editorTheme : ('github' as const)

export const getdisplayedColumns = (state: RootState) =>
  state &&
  state.app &&
  state.app.present.output &&
  state.app.present.output.table &&
  state.app.present.output.table.displayedColumns
    ? [...state.app.present.output.table.displayedColumns]
    : []
export const getOutputarray = (state: RootState) =>
  state && state.app && state.app.present.output && Array.isArray(state.app.present.output.obj)
    ? [...state.app.present.output.obj]
    : []
export const getColumns = (state: RootState) =>
  state &&
  state.app &&
  state.app.present.output &&
  state.app.present.output.table &&
  state.app.present.output.table.columns
    ? [...state.app.present.output.table.columns]
    : []
export const getGroupBy = (state: RootState) =>
  state &&
  state.app &&
  state.app.present.output &&
  state.app.present.output.table &&
  state.app.present.output.table.groupBy
    ? [...state.app.present.output.table.groupBy]
    : []

export const getQueryText = (state: RootState) =>
  state && state.app && state.app.present.query && state.app.present.query.text ? state.app.present.query.text : ''
export const getQueryMode = (state: RootState) =>
  state && state.app && state.app.present.query && state.app.present.query.mode
    ? state.app.present.query.mode
    : ('SQL' as const)

export const getSourceText = (state: RootState) =>
  state && state.app && state.app.present.source && state.app.present.source.text ? state.app.present.source.text : ''
export const getSourceAutoFormat = (state: RootState) =>
  state && state.app && state.app.present.source ? !!state.app.present.source.autoFormat : false

export const getCanRedo = (state: RootState) =>
  state && state.app && state.app.future ? state.app.future.length !== 0 : false
export const getCanUndo = (state: RootState) =>
  state && state.app && state.app.past ? state.app.past.length > 1 : false
