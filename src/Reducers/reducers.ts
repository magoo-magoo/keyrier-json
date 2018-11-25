import { combineReducers, Reducer } from 'redux';
import { Action, UpdateSource } from '../Actions/actions';
import { codeEvaluation } from '../helpers/code';
import { jsonParseSafe } from '../helpers/json';
import {
  OupoutState,
  QueryState,
  AppState,
  SourceState,
  OupoutTableState,
  getInitialAppState,
  itemType,
  UserSettingsState,
  getInitialUserSettingsState,
  QueryMode,
  tabType,
} from '../State/State';
import { logError, logWarning } from '../helpers/logger';
import { containsIgnoreCase } from '../helpers/string';

export const rootReducer = (
  rootState: Readonly<AppState> = getInitialAppState(),
  action: Action
): AppState => {
  const newState = {
    ...rootState,
    query: query(rootState.query, action),
    source: source(rootState.source, action),
  };

  const newOutputState = output(
    newState.output,
    newState.source.text,
    newState.query.text,
    action,
    newState.query.mode
  );
  return {
    ...newState,
    output: {
      ...newOutputState,
      table: table(newOutputState.table, action),
    },
  };
};

export const crashReporter = (
  rootReducerFn: Reducer<AppState>,
  state: AppState,
  action: Action
): AppState => {
  try {
    return rootReducerFn(state, action);
  } catch (error) {
    logError(error, state);
    logWarning('You may need to clear local storage !!!');

    return { ...state, error };
  }
};

export const sourceText = (
  state: Readonly<SourceState>,
  action: UpdateSource
) => ({
  ...state,
  text: action.source,
});

export const source = (state: Readonly<SourceState>, action: Action) => {
  switch (action.type) {
    case 'UPDATE_SOURCE_TEXT':
      return sourceText(state, action);
    default:
      return state;
  }
};
export const userSettings = (
  state: Readonly<UserSettingsState> = getInitialUserSettingsState(),
  action: Action
) => {
  switch (action.type) {
    case 'SWITCH_GLOBAL_THEME':
      return { ...state, globalTheme: action.theme };
    default:
      return state;
  }
};

export const query = (state: Readonly<QueryState>, action: Action) => {
  switch (action.type) {
    case 'UPDATE_QUERY':
      return {
        ...state,
        text: action.query,
      };
    case 'UPDATE_QUERY_MODE':
      return {
        ...state,
        mode: action.mode,
        text:
          action.mode === 'Javascript'
            ? getInitialAppState().query.text
            : 'select * from data',
      };
    default:
      return state;
  }
};

export const outputTable = (
  state: Readonly<OupoutTableState>,
  action: Action
) => {
  switch (action.type) {
    case 'UPDATE_TABLE_COLUMNS':
      return { ...state, columns: action.columns };
    default:
      return state;
  }
};
interface Map<T> {
  [key: string]: T;
}
export const computeOutput = (
  previousState: Readonly<OupoutState>,
  sourceString: string,
  queryString: string,
  action: Action,
  mode: QueryMode
): OupoutState => {
  const text = codeEvaluation(sourceString, queryString, mode);
  if (text === null) {
    return {
      selectedTab: 'RawJson',
      text: '',
      obj: null,
      searchTerm: '',
      match: false,
      table: {
        array: [],
        isArray: false,
        isModalOpen: false,
        displayedColumns: [],
        columns: [],
        groupBy: [],
      },
    };
  }
  if (text instanceof Error) {
    return {
      selectedTab: 'RawJson',
      text: '',
      obj: null,
      searchTerm: '',
      match: false,
      errorMessage: text.message,
      table: {
        isArray: false,
        array: [],
        isModalOpen: false,
        displayedColumns: [],
        columns: [],
        groupBy: [],
      },
    };
  }

  let displayedColumns = new Array<string>();
  const array: itemType[] = jsonParseSafe(text);
  const isArray = Array.isArray(array);
  if (isArray) {
    const keyMap: Map<string> = {};
    array
      .filter(d => d)
      .filter(d => typeof d === 'object')
      .filter(d => !Object.is(d, {}))
      .filter(d => !Array.isArray(d))
      .map(d => (d ? Object.keys(d) : []))
      .forEach(keysToAdd => {
        keysToAdd.forEach(key => (keyMap[key] = key));
      });
    displayedColumns = Object.keys(keyMap)
      .filter(key => key)
      .filter(key => typeof key === 'string')
      .filter(key => key.trim() !== '')
      .sort((ax, b) => ax.toLowerCase().localeCompare(b.toLowerCase()));
  }
  const isModalOpen =
    action.type === 'TOGGLE_OUTPUT_TABLE_MODAL'
      ? !previousState.table.isModalOpen
      : previousState.table.isModalOpen;

  let selectedTab: tabType = isArray ? 'Table' : 'RawJson';

  if (action.type === 'UPDATE_OUTPUT_TAB_SELECTION') {
    selectedTab = action.tab;
  }
  return {
    selectedTab,
    text,
    obj: jsonParseSafe(text),
    searchTerm: '',
    match: false,
    table: {
      array: isArray ? array : [],
      isArray,
      isModalOpen,
      displayedColumns,
      columns: displayedColumns,
      groupBy: [],
    },
  };
};

export const output = (
  previousState: OupoutState,
  sourceString: string,
  queryString: string,
  action: Action,
  mode: QueryMode
): OupoutState => {
  switch (action.type) {
    case '@@INIT':
    case 'EVALUATE_CODE':
    case 'RESET_EDITOR':
    case 'UPDATE_QUERY':
    case 'UPDATE_SOURCE_TEXT':
    case 'UPDATE_OUTPUT_TAB_SELECTION':
      return computeOutput(
        previousState,
        sourceString,
        queryString,
        action,
        mode
      );
    case 'TOGGLE_OUTPUT_TABLE_MODAL':
      return {
        ...previousState,
        table: {
          ...previousState.table,
          isModalOpen: !previousState.table.isModalOpen,
        },
      };
    case 'UPDATE_OUTPUT_TAB_SELECTION':
      return {
        ...previousState,
        selectedTab: action.tab,
      };
    case 'UPDATE_OUTPUT_SEARCH_TERM':
      return {
        ...filter(
          computeOutput(previousState, sourceString, queryString, action, mode),
          action.searchTerm
        ),
        searchTerm: action.searchTerm,
        selectedTab: 'RawJson',
      };
    default:
      return previousState;
  }
};

export const containsTerm = (src: any | any[] | null, searchTerm: string) => {
  if (typeof src !== 'string' && typeof src !== 'object') {
    return { match: false, filteredObj: src };
  }

  if (typeof src === 'string') {
    if (containsIgnoreCase(src, searchTerm)) {
      return { match: true, filteredObj: src };
    }
    return { match: false, filteredObj: src };
  }
  const obj: { [key: string]: any } = Array.isArray(src)
    ? [...src]
    : { ...src };

  const keys = Array.isArray(obj)
    ? Array.from({ length: obj.length }, (_v, k) => k)
    : Object.getOwnPropertyNames(obj).filter(propertyName => propertyName);

  let result = false;
  for (let i = 0; i < keys.length; i++) {
    const propertyName: string | number = keys[i];
    const propertyNameContains =
      typeof propertyName === 'string' &&
      containsIgnoreCase(propertyName, searchTerm);
    if (propertyNameContains) {
      result = true;
      continue;
    }
    const child = obj[propertyName];
    const { match, filteredObj } = containsTerm(child, searchTerm);
    if (propertyNameContains || match) {
      result = true;
      obj[propertyName] = filteredObj;
    } else {
      if (Array.isArray(obj) && typeof propertyName === 'number') {
        obj.splice(propertyName, 1);
      } else {
        delete obj[propertyName];
      }
    }
  }
  if (!result) {
    if (!Array.isArray(obj)) {
      (keys as string[]).forEach(
        (propertyName: string) => delete obj[propertyName]
      );
    } else {
      obj.length = 0;
    }
  }
  return { match: result, filteredObj: obj };
};

const filter = (state: OupoutState, _searchTerm: string) => {
  if (!_searchTerm && _searchTerm.trim() === '') {
    return { ...state, match: false };
  }
  const { filteredObj, match } = containsTerm(state.obj, _searchTerm);
  if (match) {
    return { ...state, obj: filteredObj, match };
  }

  return state;
};

export const table = (state: OupoutTableState, action: Action) => {
  switch (action.type) {
    case 'UPDATE_TABLE_COLUMNS':
      let groupByList = state.groupBy;
      groupByList.forEach(groupBy => {
        if (action.columns.indexOf(groupBy) === -1) {
          groupByList = groupByList.filter(
            gb => action.columns.indexOf(gb) !== -1
          );
        }
      });
      return {
        ...state,
        displayedColumns: action.columns,
        groupBy: groupByList,
      };
    case 'UPDATE_TABLE_GROUP_BY':
      return {
        ...state,
        groupBy: action.groupBy
          .filter(gb => state.displayedColumns.indexOf(gb) !== -1)
          .filter(gb => gb !== 'Group by...'),
      };
    default:
      return state;
  }
};

export const rootReducerReset = (
  state: Readonly<AppState> | undefined,
  action: Action
) => {
  if (action.type === 'RESET_EDITOR') {
    return rootReducer({ ...getInitialAppState() }, action);
  }
  return rootReducer(state, action);
};
const rootReducers = combineReducers({
  app: rootReducerReset,
  userSettings,
});
export default rootReducers;
