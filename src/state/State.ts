import { configuration } from 'config'
import { StateWithHistory } from 'redux-undo'
import { EditorTheme, GeneralTheme } from 'themes/themes'
import { DeepReadonly } from 'utility-types'
import initialStateJson from './default-state.json'

export type itemType = any

export type AppState = DeepReadonly<{
    source?: SourceState
    query?: QueryState
    output?: OupoutState
    error?: Error
}>
export type QueryState = DeepReadonly<{
    text?: string
    mode?: QueryMode
}>
export type SourceState = DeepReadonly<{
    text?: string
    autoFormat?: boolean
}>
export type OupoutState = DeepReadonly<{
    searchTerm?: string
    match?: boolean
    selectedTab?: tabType
    obj?: object | null
    objSize?: number
    errorMessage?: string
    table?: OupoutTableState
}>
export type OupoutTableState = DeepReadonly<{
    isArray?: boolean
    isModalOpen?: boolean
    displayedColumns?: readonly string[]
    columns?: readonly string[]
    groupBy?: readonly string[]
}>
export type UserSettingsState = DeepReadonly<{
    globalTheme?: GeneralTheme
    editorTheme?: EditorTheme
    debugMode?: boolean
    layouts: ReactGridLayout.Layouts
}>

export type tabType = 'RawJson' | 'Table'
export type QueryMode = 'Javascript' | 'SQL'

export type RootState = DeepReadonly<{
    app?: StateWithHistory<AppState>
    userSettings?: UserSettingsState
}>

export const getDefaultAppState = () => initialStateJson as AppState
export const defaultAppState = initialStateJson as AppState
export const getDefaultUserSettingsState = () =>
    ({
        globalTheme: 'pulse',
        editorTheme: 'github',
        debugMode: false,
        layouts: {
            lg: [
                { i: configuration.layout.keys.lateralMenuKey, x: 18, y: 0, w: 3, h: 20, minW: 3, minH: 20 },
                { i: configuration.layout.keys.sourceEditorKey, x: 3, y: 0, w: 7, h: 15, minW: 5, minH: 10 },
                { i: configuration.layout.keys.queryEditorKey, x: 10, y: 0, w: 7, h: 15, minW: 5, minH: 10 },
                { i: configuration.layout.keys.outputKey, x: 3, y: 15, w: 14, h: 30, minW: 12, minH: 15 },
            ],
        },
    } as const)

export const emptyState = {
    source: { text: '', autoFormat: true },
    query: { text: '', mode: 'SQL' },
    output: {
        match: false,
        obj: {},
        objSize: 2,
        searchTerm: '',
        selectedTab: 'RawJson',
        table: {
            isArray: false,
            columns: [],
            displayedColumns: [],
            isModalOpen: false,
            groupBy: [],
        },
    },
} as const
