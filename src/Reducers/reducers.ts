import { combineReducers, Store, Dispatch, Reducer } from "redux";
import { Action, UpdateSource } from "../Actions/actions";
import { codeEvaluation } from "../helpers/code";
import { jsonParseSafe } from "../helpers/json";
import {
  OupoutState,
  QueryState,
  RootState,
  SourceState,
  OupoutTableState,
  getInitialState,
  itemType
} from "../State/State";
import { logError, logWarning } from "../helpers/logger";

export const rootReducer = (
  rootState: Readonly<RootState> = getInitialState(),
  action: Action
): RootState => {
  const newState = {
    ...rootState,
    query: query(rootState.query, action),
    source: source(rootState.source, action)
  };

  const newOutputState = output(
    newState.output,
    newState.source.text,
    newState.query.text,
    action
  );
  return {
    ...newState,
    output: {
      ...newOutputState,
      table: table(newOutputState.table, action)
    }
  };
};

export const crashReporter = (
  rootReducerFn: Reducer<RootState>,
  state: RootState,
  action: Action
): RootState => {
  try {
    return rootReducerFn(state, action);
  } catch (error) {
    logError(error, state);
    logWarning("You may need to clear local storage !!!");

    return { ...state, error };
  }
};

export const sourceText = (
  state: Readonly<SourceState>,
  action: UpdateSource
) => ({
  ...state,
  text: action.source
});

export const source = (state: Readonly<SourceState>, action: Action) => {
  switch (action.type) {
    case "UPDATE_SOURCE_TEXT":
      return sourceText(state, action);
    default:
      return state;
  }
};

export const query = (state: Readonly<QueryState>, action: Action) => {
  switch (action.type) {
    case "UPDATE_QUERY":
      return {
        ...state,
        text: action.query
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
    case "UPDATE_TABLE_COLUMNS":
      return { ...state, columns: action.columns };
    default:
      return state;
  }
};

export const computeOutput = (
  previousState: Readonly<OupoutState>,
  sourceString: string,
  queryString: string,
  action: Action
): OupoutState => {
  const text = codeEvaluation(sourceString, queryString);
  if (text === null) {
    return {
      text: "",
      table: {
        array: [],
        isArray: false,
        isModalOpen: false,
        displayedColumns: [],
        columns: [],
        groupBy: []
      }
    };
  }
  if (text instanceof Error) {
    return {
      text: "",
      errorMessage: text.message,
      table: {
        isArray: false,
        array: [],
        isModalOpen: false,
        displayedColumns: [],
        columns: [],
        groupBy: []
      }
    };
  }

  let displayedColumns = new Array<string>();
  const array: itemType[] = jsonParseSafe(text);
  const isArray = Array.isArray(array);
  if (isArray) {
    const keyMap = new Map<any, any>();
    array
      .filter(d => d)
      .filter(d => typeof d === "object")
      .filter(d => !Object.is(d, {}))
      .filter(d => !Array.isArray(d))
      .map(d => (d ? Object.keys(d) : []))
      .forEach(keysToAdd => {
        keysToAdd.forEach(key => (keyMap[key] = key));
      });
    displayedColumns = Object.keys(keyMap)
      .filter(key => key)
      .filter(key => typeof key === "string")
      .filter(key => key.trim() !== "")
      .sort((ax, b) => ax.toLowerCase().localeCompare(b.toLowerCase()));
  }
  const isModalOpen =
    action.type === "TOGGLE_OUTPUT_TABLE_MODAL"
      ? !previousState.table.isModalOpen
      : previousState.table.isModalOpen;
  return {
    text,
    table: {
      array: isArray ? array : [],
      isArray,
      isModalOpen,
      displayedColumns,
      columns: displayedColumns,
      groupBy: []
    }
  };
};

export const output = (
  previousState: OupoutState,
  sourceString: string,
  queryString: string,
  action: Action
): OupoutState => {
  switch (action.type) {
    case "@@INIT":
    case "EVALUATE_CODE":
    case "RESET_EDITOR":
    case "UPDATE_QUERY":
    case "UPDATE_SOURCE_TEXT":
      return computeOutput(previousState, sourceString, queryString, action);
    case "TOGGLE_OUTPUT_TABLE_MODAL":
      return {
        ...previousState,
        table: {
          ...previousState.table,
          isModalOpen: !previousState.table.isModalOpen
        }
      };
    default:
      return previousState;
  }
};

export const table = (state: OupoutTableState, action: Action) => {
  switch (action.type) {
    case "UPDATE_TABLE_COLUMNS":
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
        groupBy: groupByList
      };
    case "UPDATE_TABLE_GROUP_BY":
      return {
        ...state,
        groupBy: action.groupBy
          .filter(gb => state.displayedColumns.indexOf(gb) !== -1)
          .filter(gb => gb !== "Group by...")
      };
    default:
      return state;
  }
};

export const rootReducerReset = (
  state: Readonly<RootState>,
  action: Action
) => {
  if (action.type === "RESET_EDITOR") {
    return rootReducer({ ...getInitialState() }, action);
  }
  return rootReducer(state, action);
};
const rootReducers = combineReducers({
  rootReducer: rootReducerReset
});
export default rootReducers;
