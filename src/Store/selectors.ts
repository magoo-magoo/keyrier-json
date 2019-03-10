import { RootState } from '../State/State'

export const getOutputErrorMessage = (state: RootState) => state.app.output.errorMessage

export const getOutputIsArray = (state: RootState) => state.app.output.table.isArray
export const getOutputActiveTab = (state: RootState) => state.app.output.selectedTab
export const getOutputObject = (state: RootState) => state.app.output.obj
export const getOutputObjectSize = (state: RootState) => state.app.output.objSize
export const getOutputSearchTerm = (state: RootState) => state.app.output.searchTerm
export const getOutputSearchMatch = (state: RootState) => state.app.output.match
export const getisOutputTableModalOpen = (state: RootState) => state.app.output.table.isModalOpen

export const getTheme = (state: RootState) => state.userSettings.globalTheme

export const getdisplayedColumns = (state: RootState) => [...state.app.output.table.displayedColumns]
export const getOutputarray = (state: RootState) =>
  Array.isArray(state.app.output.obj) ? [...state.app.output.obj] : []
export const getColumns = (state: RootState) => [...state.app.output.table.columns]
export const getGroupBy = (state: RootState) => [...state.app.output.table.groupBy]

export const getQueryText = (state: RootState) => state.app.query.text
export const getQueryMode = (state: RootState) => state.app.query.mode

export const getSourceText = (state: RootState) => state.app.source.text
export const getSourceAutoFormat = (state: RootState) => state.app.source.autoFormat
