import { combineReducers } from "redux";
import { Action, UpdateSource } from "../Actions/actions";
import { codeEvaluation } from "../helpers/code";
import { jsonParseSafe } from "../helpers/json";
import {
  initialState,
  OupoutState,
  QueryState,
  RootState,
  SourceState
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

  return { ...newState, output: output(newState.source.text, newState.query.text) };
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

export const output = (
  sourceString: string,
  queryString: string
): OupoutState => {
  const text = codeEvaluation(sourceString, queryString);
  if (text === null) {
    return { isArray: false, text: "", array: [{ a: 1 }] };
  }
  if (text instanceof Error) {
    return {
      isArray: false,
      text: "",
      errorMessage: text.message,
      array: [{ b: 2 }]
    };
  }

  const array = jsonParseSafe(text);
  const isArray = Array.isArray(array);
  return { text, isArray, array: isArray ? array : [] };
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
