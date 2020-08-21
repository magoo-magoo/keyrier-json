import { getDefaultUserSettingsState, RootState } from 'state/State'

const copyArrayOrEmpty = <T = unknown>(array: readonly T[] | null | undefined) => {
    if (!array) {
        return [] as T[]
    }

    return [...array] as T[]
}

export const getOutputErrorMessage = (state: RootState) => state?.app?.present?.output?.errorMessage ?? ''
export const getOutputIsArray = (state: RootState) => !!state?.app?.present?.output?.table?.isArray
export const getOutputActiveTab = (state: RootState) => state?.app?.present?.output?.selectedTab ?? ('RawJson' as const)
export const getOutputObject = (state: RootState) => state?.app?.present?.output?.obj ?? {}
export const getOutputObjectSize = (state: RootState) => state?.app?.present?.output?.objSize ?? 0
export const getOutputSearchTerm = (state: RootState) => state?.app?.present?.output?.searchTerm
export const getOutputSearchMatch = (state: RootState) => !!state?.app?.present?.output?.match
export const getisOutputTableModalOpen = (state: RootState) => !!state?.app?.present?.output?.table?.isModalOpen

export const getTheme = (state: RootState) => state?.userSettings?.globalTheme ?? getDefaultUserSettingsState().globalTheme
export const getEditorTheme = (state: RootState) => state?.userSettings?.editorTheme ?? getDefaultUserSettingsState().editorTheme
export const getLayouts = (state: RootState) =>
    (state?.userSettings?.layouts ?? getDefaultUserSettingsState().layouts) as ReactGridLayout.Layouts

export const getdisplayedColumns = (state: RootState) => copyArrayOrEmpty(state?.app?.present?.output?.table?.displayedColumns)
export const getOutputarray = (state: RootState) =>
    Array.isArray(state?.app?.present?.output?.obj) ? copyArrayOrEmpty(state?.app?.present?.output?.obj) : []
export const getColumns = (state: RootState) => copyArrayOrEmpty(state?.app?.present?.output?.table?.columns)
export const getGroupBy = (state: RootState) => copyArrayOrEmpty(state?.app?.present?.output?.table?.groupBy)

export const getQueryText = (state: RootState) => state?.app?.present?.query?.text ?? ''
export const getQueryMode = (state: RootState) => state?.app?.present?.query?.mode ?? ('SQL' as const)
export const getSourceText = (state: RootState) => state?.app?.present?.source?.text ?? ''
export const getSourceAutoFormat = (state: RootState) => !!state?.app?.present?.source?.autoFormat
export const getCanRedo = (state: RootState) => state?.app?.future?.length !== 0
export const getCanUndo = (state: RootState) => (state?.app?.past?.length ?? 0) > 1
export const getDebugMode = (state: RootState) => !!state?.userSettings?.debugMode
