import initialStateJson from './default-state.json'
import { GeneralTheme, EditorTheme } from 'themes/themes'
import { DeepReadonly } from 'utility-types'
import { PropType as PropertyTypeOf } from 'core/misc/utils'
import { StateWithHistory } from 'redux-undo'

export type itemType = any

export type All = PropertyTypeOf<AppState>
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
  } as const)

export const emptyState = {
  source: { text: '', autoFormat: true },
  query: { text: '', mode: 'Javascript' },
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
