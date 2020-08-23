import { createReducer } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import undoable from 'redux-undo'

import actions, { Action } from '../actions/actions'
import { configuration } from '../config'
import { codeEvaluation } from '../core/code'
import { jsonBeautify } from '../core/converters/json'
import { containsIgnoreCase } from '../core/converters/string'
import { arrayElementName } from '../models/array'
import initialStateJson from '../state/default-state.json'
import * as State from '../state/State'

export const appReducer = createReducer<State.AppState>(State.getDefaultAppState(), (builder) =>
    builder
        .addCase(actions.clearEditor, () => State.emptyState)
        .addMatcher<Action>(
            (action): action is Exclude<Action, ReturnType<typeof actions.clearEditor>> => action.type !== 'CLEAR_EDITOR',
            (draft, action) => {
                if (draft.query) {
                    draft.query = query(draft.query, action)
                }
                if (draft.source) {
                    draft.source = source(draft.source, action)
                }

                switch (action.type) {
                    case 'UPDATE_QUERY':
                    case 'UPDATE_SOURCE_TEXT':
                    case 'RESET_EDITOR':
                    case 'UPDATE_QUERY_MODE':
                        draft.output = computeOutput(
                            draft.output,
                            draft.source?.text ? draft.source.text : '',
                            draft.query?.text ? draft.query.text : '',
                            action,
                            draft.query?.mode ? draft.query.mode : 'SQL',
                        )
                        return
                    case 'TOGGLE_OUTPUT_TABLE_MODAL':
                        if (draft.output?.table) {
                            draft.output.table.isModalOpen = !draft.output.table?.isModalOpen
                        }
                        return

                    case 'UPDATE_OUTPUT_TAB_SELECTION':
                        if (draft.output) {
                            draft.output.selectedTab = action.payload
                        }
                        return
                    case 'UPDATE_OUTPUT_SEARCH_TERM':
                        if (draft.output) {
                            draft.output = filter(draft.output, action.payload)
                            draft.output.searchTerm = action.payload
                            draft.output.selectedTab = 'RawJson'
                        }
                        return
                }
            },
        )
        .addMatcher(
            (_action): _action is Action => true,
            (draft, action) => {
                if (draft.output) {
                    draft.output.table = table(draft.output?.table, action)
                }
            },
        ),
)

export const source = createReducer<State.SourceState>({}, (builder) =>
    builder
        .addCase(actions.updateSource, (state, action) => {
            state.text = state?.autoFormat ? jsonBeautify(action.payload.trim()) : action.payload
        })
        .addCase(actions.updateAutoFormatSource, (state, action) => {
            state.text = action.payload ? jsonBeautify(state?.text?.trim()) : state?.text ?? ''
            state.autoFormat = action.payload
        }),
)

export const userSettings = createReducer<State.UserSettingsState>(State.getDefaultUserSettingsState(), (builder) =>
    builder
        .addCase(actions.resetEditor, () => State.getDefaultUserSettingsState())
        .addCase(actions.switchTheme, (state, action) => {
            state.globalTheme = action.payload
        })
        .addCase(actions.switchEditorTheme, (state, action) => {
            state.editorTheme = action.payload
        })
        .addCase(actions.updateLayouts, (state, action) => {
            state.layouts = action.payload
        }),
)
export const query = createReducer<State.QueryState>({}, (builder) =>
    builder
        .addCase(actions.updateQuery, (state, action) => {
            state.text = action.payload
        })
        .addCase(actions.updateQueryMode, (state, action) => {
            state.mode = action.payload
            state.text =
                action.payload === 'SQL'
                    ? initialStateJson.query.text
                    : '// data is your JSON object\n// you can use any correct javascript code to query it\n// in addition of that,\n// \n\n      data\n    '
        }),
)

export const computeOutput = (
    previousState: State.OupoutState | undefined,
    sourceString: string,
    queryString: string,
    action: Action,
    mode: State.QueryMode,
) => {
    const evaluation = codeEvaluation(sourceString, queryString, mode)

    if (evaluation instanceof Error) {
        return {
            selectedTab: 'RawJson' as const,
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
        }
    }

    const { text, obj } = evaluation ?? { text: null, obj: null }
    let displayedColumns = new Array<string>()
    if (Array.isArray(obj)) {
        const keyMap: { [key: string]: string } = {}
        obj.forEach((d) => {
            if (d !== null && d !== undefined && !Object.is(d, {}) && !Array.isArray(d)) {
                const keysToAdd = d ? (typeof d === 'object' ? Object.keys(d) : [arrayElementName]) : []
                keysToAdd.forEach((key) => (keyMap[key] = key))
            }
        })
        displayedColumns = Object.keys(keyMap)
            .filter((key) => key && typeof key === 'string' && key.trim() !== '')
            .sort((ax, b) => ax.toLowerCase().localeCompare(b.toLowerCase()))
    }
    const isModalOpen =
        previousState && previousState.table && action.type === 'TOGGLE_OUTPUT_TABLE_MODAL'
            ? previousState && !previousState.table.isModalOpen
            : previousState && previousState.table
            ? previousState.table.isModalOpen
            : false

    let selectedTab: State.tabType = Array.isArray(obj) ? 'Table' : 'RawJson'

    if (action.type === 'UPDATE_OUTPUT_TAB_SELECTION') {
        selectedTab = action.payload
    }
    return {
        selectedTab,
        obj: obj,
        objSize: text ? text.length : 0,
        searchTerm: '',
        match: false,
        table: {
            isArray: Array.isArray(obj),
            isModalOpen,
            displayedColumns,
            columns: displayedColumns,
            groupBy: previousState?.table?.groupBy ?? [],
        },
    }
}

const table = createReducer<State.OupoutTableState>(State.getDefaultAppState().output.table as State.OupoutTableState, (builder) =>
    builder
        .addCase(actions.updateTableColumns, (state, action) => {
            state.displayedColumns = action.payload

            if (!state.groupBy) {
                return
            }
            for (let i = 0; i < state.groupBy.length; i++) {
                const element = state.groupBy[i]
                if (!action.payload.includes(element)) {
                    state.groupBy.splice(i, 1)
                }
            }
        })
        .addCase(actions.updateTableGroupBy, (state, action) => {
            state.groupBy = action.payload
                .filter((gb) => state && state.displayedColumns && state.displayedColumns.indexOf(gb) !== -1)
                .filter((gb) => gb !== 'Group by...')
        }),
)

export const containsTerm = (src: any, searchTerm: string) => {
    if (typeof src !== 'string' && typeof src !== 'object') {
        return { match: false, filteredObj: src }
    }

    if (typeof src === 'string') {
        if (containsIgnoreCase(src, searchTerm)) {
            return { match: true, filteredObj: src }
        }
        return { match: false, filteredObj: src }
    }
    const obj: { [key: string]: unknown } = Array.isArray(src) ? [...src] : { ...src }

    const keys = Array.isArray(obj)
        ? Array.from({ length: obj.length }, (_, k) => k)
        : Object.getOwnPropertyNames(obj).filter((propertyName) => propertyName)

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
            keys.forEach((propertyName: string | number) => delete obj[propertyName])
        } else {
            obj.length = 0
        }
    }
    return { match: result, filteredObj: obj }
}

const filter = (state: State.OupoutState, searchTerm: string) => {
    if (!searchTerm || searchTerm.trim() === '' || !state) {
        return { ...state, match: false }
    }
    const { filteredObj, match } = containsTerm(state.obj, searchTerm)
    if (match) {
        return { ...state, obj: filteredObj, match }
    }

    return state
}

export const resetApp = (state: State.AppState = State.getDefaultAppState(), action: Action) => {
    if (action.type === 'RESET_EDITOR') {
        return appReducer(State.getDefaultAppState(), action)
    }
    return appReducer(state, action)
}

const rootReducers = combineReducers({
    app: undoable(resetApp, {
        undoType: 'APP_UNDO',
        redoType: 'APP_REDO',
        limit: configuration.limitUndo,
    }),
    userSettings,
})
export default rootReducers
