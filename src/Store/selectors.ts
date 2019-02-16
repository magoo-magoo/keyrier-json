import { RootState } from '../State/State'

export const getOutputErrorMessage = (state: RootState) => state.app.output.errorMessage

export const getOutputIsArray = (state: RootState) => state.app.output.table.isArray
export const getOutputActiveTab = (state: RootState) => state.app.output.selectedTab
export const getOutputObject = (state: RootState) => state.app.output.obj
export const getOutputSearchTerm = (state: RootState) => state.app.output.searchTerm
export const getOutputSearchMatch = (state: RootState) => state.app.output.match

export const getOutputTableData = (state: RootState) => [...state.app.output.table.array]

export const getisOutputTableModalOpen = (state: RootState) => state.app.output.table.isModalOpen

export const getTheme = (state: RootState) => state.userSettings.globalTheme

export const getdisplayedColumns = (state: RootState) => [...state.app.output.table.displayedColumns]
export const getTableArray = (state: RootState) => [...state.app.output.table.array]
export const getColumns = (state: RootState) => [...state.app.output.table.columns]
export const getGroupBy = (state: RootState) => [...state.app.output.table.groupBy]

export const getQueryText = (state: RootState) => state.app.query.text
export const getSourceText = (state: RootState) => state.app.source.text
export const getQueryMode = (state: RootState) => state.app.query.mode
