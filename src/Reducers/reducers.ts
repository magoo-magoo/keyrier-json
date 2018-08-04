import { combineReducers } from "redux";
import { Action, UpdateSource } from "../Actions/actions";
import { codeEvaluation } from "../helpers/code";
import { jsonParseSafe } from "../helpers/json";
import {
  initialState,
  OupoutState,
  QueryState,
  RootState,
  SourceState,
  OupoutTableState
} from "../State/State";

export const rootReducer = (
  rootState: Readonly<RootState> = initialState,
  action: Action
): RootState => {
  const newState = {
    ...rootState,
    query: query(rootState.query, action),
    source: source(rootState.source, action)
  };

  return {
    ...newState,
    output: output(
      rootState.output,
      newState.source.text,
      newState.query.text,
      action
    )
  };
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
      // tslint:disable-next-line:no-debugger
      debugger;
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
        columns: []
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
        columns: []
      }
    };
  }
  let displayedColumns = new Array<string>();
  const array: Array<{}> = jsonParseSafe(text);
  const isArray = Array.isArray(array);
  if (isArray) {
    const keyMap = new Map<any, any>();
    array
      .filter(d => d)
      .filter(d => typeof d === "object")
      .filter(d => !Object.is(d, {}))
      .filter(d => !Array.isArray(d))
      .map(d => Object.keys(d))
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
      columns: displayedColumns
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
    case "UPDATE_TABLE_COLUMNS":
      return {
        ...previousState,
        table: { ...previousState.table, displayedColumns: action.columns }
      };
    default:
      return previousState;
  }
};

export const rootReducerReset = (
  state: Readonly<RootState>,
  action: Action
) => {
  if (action.type === "RESET_EDITOR") {
    state = initialState;
  }
  return rootReducer(state, action);
};

const rootReducers = combineReducers({
  rootReducer: rootReducerReset
});
export default rootReducers;
