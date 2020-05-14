import { combineReducers } from 'redux'
import undoable from 'redux-undo'
import { Action } from '../actions/actions'
import { configuration } from '../config'
import { codeEvaluation } from '../core/code'
import { jsonBeautify } from '../core/converters/json'
import { containsIgnoreCase } from '../core/converters/string'
import { perfEnd, perfStart } from '../core/logging/performance'
import { arrayElementName } from '../models/array'
import initialStateJson from '../state/default-state.json'
import {
    AppState,
    emptyState,
    getDefaultAppState,
    getDefaultUserSettingsState,
    itemType,
    OupoutState,
    OupoutTableState,
    QueryMode,
    QueryState,
    SourceState,
    tabType,
    UserSettingsState,
} from '../state/State'

export const rootReducer = (rootState = getDefaultAppState(), action: Action) => {
    if (action.type === 'CLEAR_EDITOR') {
        return emptyState
    }
    const newState =
        rootState?.query && rootState?.source
            ? ({
                  ...rootState,
                  query: query(rootState.query, action),
                  source: source(rootState.source, action),
              } as const)
            : {}

    const newOutputState = output(rootState, newState, action)
    const ret = {
        ...newState,
        output: {
            ...newOutputState,
            table: table(newOutputState?.table ?? {}, action),
        },
    }

    return ret
}

export const source = (state: SourceState, action: Action) => {
    switch (action.type) {
        case 'UPDATE_SOURCE_TEXT':
            return {
                ...state,
                text: state?.autoFormat ? jsonBeautify(action.source.trim()) : action.source,
            }
        case 'UPDATE_AUTOFORMAT_SOURCE':
            return {
                ...state,
                text: action.active ? jsonBeautify(state?.text?.trim()) : state?.text ?? '',
                autoFormat: action.active,
            }
        default:
            return state
    }
}

export const userSettings = (state: UserSettingsState | undefined = getDefaultUserSettingsState(), action: Action) => {
    switch (action.type) {
        case 'SWITCH_GLOBAL_THEME':
            return { ...state, globalTheme: action.theme }
        case 'SWITCH_EDITOR_THEME':
            return { ...state, editorTheme: action.theme }
        case 'UPDATE_LAYOUTS':
            return { ...state, layouts: action.layouts }
        default:
            return state
    }
}

export const query = (state: QueryState, action: Action) => {
    switch (action.type) {
        case 'UPDATE_QUERY':
            return {
                ...state,
                text: action.query,
            }
        case 'UPDATE_QUERY_MODE':
            return {
                ...state,
                mode: action.mode,
                text:
                    action.mode === 'SQL'
                        ? initialStateJson.query.text
                        : "// data is your JSON object\n// you can use any correct javascript code to query it\n// in addition of that,\n// you can use lodash helper functions. see https://lodash.com/docs/\n// ex: _.chain(data).orderBy('age', 'desc')\n\n      data\n    ",
            } as const
        default:
            return state
    }
}

export const computeOutput = (
    previousState: OupoutState,
    sourceString: string,
    queryString: string,
    action: Action,
    mode: QueryMode
) => {
    const evaluation = codeEvaluation(sourceString, queryString, mode)

    if (evaluation instanceof Error) {
        return {
            selectedTab: 'RawJson',
            obj: null,
            objSize: 0,
            searchTerm: '',
            match: false,
            errorMessage: evaluation.message,
            table: {
                isArray: false,
                isModalOpen: false,
                displayedColumns: [],
                columns: [],
                groupBy: [],
            },
        } as const
    }

    const { text, obj } = evaluation ?? { text: null, obj: null }
    let displayedColumns = new Array<string>()
    const outputObject: itemType[] | object = obj as any
    if (Array.isArray(outputObject)) {
        const keyMap: { [key: string]: string } = {}
        outputObject.forEach(d => {
            if (d !== null && d !== undefined && !Object.is(d, {}) && !Array.isArray(d)) {
                const keysToAdd = d ? (typeof d === 'object' ? Object.keys(d) : [arrayElementName]) : []
                keysToAdd.forEach(key => (keyMap[key] = key))
            }
        })
        displayedColumns = Object.keys(keyMap)
            .filter(key => key && typeof key === 'string' && key.trim() !== '')
            .sort((ax, b) => ax.toLowerCase().localeCompare(b.toLowerCase()))
    }
    const isModalOpen =
        previousState && previousState.table && action.type === 'TOGGLE_OUTPUT_TABLE_MODAL'
            ? previousState && !previousState.table.isModalOpen
            : previousState && previousState.table
            ? previousState.table.isModalOpen
            : false

    let selectedTab: tabType = Array.isArray(outputObject) ? 'Table' : 'RawJson'

    if (action.type === 'UPDATE_OUTPUT_TAB_SELECTION') {
        selectedTab = action.tab
    }
    return {
        selectedTab,
        obj: outputObject,
        objSize: text ? text.length : 0,
        searchTerm: '',
        match: false,
        table: {
            isArray: Array.isArray(outputObject),
            isModalOpen,
            displayedColumns,
            columns: displayedColumns,
            groupBy: [],
        },
    } as const
}

export const output = (previousState: AppState, newState: AppState | null, action: Action) => {
    switch (action.type) {
        case 'UPDATE_QUERY':
        case 'UPDATE_SOURCE_TEXT':
        case 'UPDATE_TABLE_COLUMNS':
        case 'UPDATE_TABLE_GROUP_BY':
            if (
                previousState?.source?.text === newState?.source?.text &&
                previousState?.query?.text === newState?.query?.text
            ) {
                return previousState.output
            }
            if (newState) {
                return computeOutput(
                    newState.output ?? {},
                    newState.source?.text ? newState.source.text : '',
                    newState.query?.text ? newState.query.text : '',
                    action,
                    newState.query?.mode ? newState.query.mode : 'SQL'
                )
            }
            break
        case 'TOGGLE_OUTPUT_TABLE_MODAL':
            return newState
                ? {
                      ...newState.output,
                      table: {
                          ...(newState.output ? newState.output.table : {}),
                          isModalOpen: newState.output?.table ? !newState.output.table.isModalOpen : false,
                      },
                  }
                : {}
        case 'UPDATE_OUTPUT_TAB_SELECTION':
            if (newState) {
                return {
                    ...newState.output,
                    selectedTab: action.tab,
                }
            }
            break
        case 'UPDATE_OUTPUT_SEARCH_TERM':
            if (newState && newState.output) {
                return {
                    ...filter(newState.output, action.searchTerm),
                    searchTerm: action.searchTerm,
                    selectedTab: 'RawJson',
                } as const
            }
            break
        default:
            if (newState?.output) {
                return computeOutput(
                    newState.output,
                    newState.source?.text ? newState.source.text : '',
                    newState.query?.text ? newState.query.text : '',
                    action,
                    newState.query?.mode ? newState.query.mode : 'SQL'
                )
            }
            break
    }
    return {}
}

export const containsTerm = (src: any | any[] | null, searchTerm: string) => {
    if (typeof src !== 'string' && typeof src !== 'object') {
        return { match: false, filteredObj: src }
    }

    if (typeof src === 'string') {
        if (containsIgnoreCase(src, searchTerm)) {
            return { match: true, filteredObj: src }
        }
        return { match: false, filteredObj: src }
    }
    const obj: { [key: string]: any } = Array.isArray(src) ? [...src] : { ...src }

    const keys = Array.isArray(obj)
        ? Array.from({ length: obj.length }, (_, k) => k)
        : Object.getOwnPropertyNames(obj).filter(propertyName => propertyName)

    let result = false

    for (const propertyName of keys) {
        const propertyNameContains = typeof propertyName === 'string' && containsIgnoreCase(propertyName, searchTerm)
        if (propertyNameContains) {
            result = true
            continue
        }
        const child = obj[propertyName]
        const { match, filteredObj } = containsTerm(child, searchTerm)
        if (propertyNameContains || match) {
            result = true
            obj[propertyName] = filteredObj
        } else {
            if (Array.isArray(obj) && typeof propertyName === 'number') {
                obj.splice(propertyName, 1)
            } else {
                delete obj[propertyName]
            }
        }
    }
    if (!result) {
        if (!Array.isArray(obj)) {
            ;(keys as string[]).forEach((propertyName: string) => delete obj[propertyName])
        } else {
            obj.length = 0
        }
    }
    return { match: result, filteredObj: obj }
}

const filter = (state: OupoutState, searchTerm: string) => {
    if (!searchTerm || searchTerm.trim() === '' || !state) {
        return { ...state, match: false }
    }
    const { filteredObj, match } = containsTerm(state.obj, searchTerm)
    if (match) {
        return { ...state, obj: filteredObj, match }
    }

    return state
}

const table = (state: OupoutTableState | undefined, action: Action) => {
    switch (action.type) {
        case 'UPDATE_TABLE_COLUMNS':
            let groupByList = state?.groupBy ? state.groupBy : []
            groupByList.forEach(groupBy => {
                if (action.columns.indexOf(groupBy) === -1) {
                    groupByList = groupByList.filter(gb => action.columns.indexOf(gb) !== -1)
                }
            })
            return {
                ...state,
                displayedColumns: action.columns,
                groupBy: groupByList,
            }
        case 'UPDATE_TABLE_GROUP_BY':
            return {
                ...state,
                groupBy: action.groupBy
                    .filter(gb => state && state.displayedColumns && state.displayedColumns.indexOf(gb) !== -1)
                    .filter(gb => gb !== 'Group by...'),
            }
        default:
            return state
    }
}

export const resetApp = (state = getDefaultAppState(), action: Action) => {
    if (action.type === 'RESET_EDITOR') {
        return rootReducer({ ...getDefaultAppState() }, action)
    }
    return rootReducer(state, action)
}

const perf = (state = getDefaultAppState(), action: Action) => {
    perfStart(`reduce - action: ${action.type}`)
    const newState = resetApp(state, action)
    perfEnd(`reduce - action: ${action.type}`)
    return newState
}

const rootReducers = combineReducers({
    app: undoable(perf, { undoType: 'APP_UNDO', redoType: 'APP_REDO', limit: configuration.limitUndo }),
    userSettings,
})
export default rootReducers