import initialStateJson from './default-state.json'
import { Theme } from 'Themes/themes.js'
import { DeepReadonly } from 'utility-types'
import { PropType as PropertyTypeOf } from 'helpers/utils.js'

export type itemType = any

export type All = PropertyTypeOf<AppState>
export type AppState = PropertyTypeOf<RootState, 'app'>
export type QueryState = PropertyTypeOf<AppState, 'query'>
export type SourceState = PropertyTypeOf<AppState, 'source'>
export type OupoutState = PropertyTypeOf<AppState, 'output'>
export type OupoutTableState = PropertyTypeOf<OupoutState, 'table'>
export type UserSettingsState = PropertyTypeOf<RootState, 'userSettings'>

export type tabType = 'RawJson' | 'Table'
export type QueryMode = 'Javascript' | 'SQL'
export type RootState = DeepReadonly<{
  app: {
    source: {
      text: string
      autoFormat: boolean
    }
    query: {
      text: string
      mode: QueryMode
    }
    output: {
      searchTerm: string
      match: boolean
      selectedTab: tabType
      obj: object | null
      objSize: number
      errorMessage?: string
      table: {
        isArray: boolean
        isModalOpen: boolean
        displayedColumns: string[]
        columns: string[]
        groupBy: string[]
      }
    }
    error?: Error
  }
  userSettings: {
    globalTheme: Theme | null
  }
}>

export const getDefaultAppState = () => initialStateJson as AppState
export const getDefaultUserSettingsState = () =>
  ({
    globalTheme: 'materia',
    concurrentModeEnable: false,
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
