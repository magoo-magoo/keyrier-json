import { combineReducers } from "redux";
import { Action,  UpdateSource } from "../Actions/actions";
import { codeEvaluation } from "../helpers/code";
import { jsonParseSafe } from "../helpers/json";
import { initialState, OupoutState, QueryState, RootState, SourceState } from "../State/State";

export const rootReducer = (
  rootState: Readonly<RootState> = initialState,
  action: Action,
): RootState => {
  const newState = {
    ...rootState,
    query: query(rootState.query, action),
    source: source(rootState.source, action),
  };

  return {...newState, output: output(newState)};
};

export const sourceText = (
  state: Readonly<SourceState>,
  action: UpdateSource,
) => ({
  ...state,
  text: action.source,
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
        text: action.query,
      };
    default:
      return state;
  }
};

export const output = (state: Readonly<RootState>) => {
  const newOutputState = outputText(state.source.text, state.query.text);
  return {
    ...state.output,
    errorMessage: newOutputState.errorMessage,
    isArray: newOutputState.isArray,
    text: newOutputState.text,
  };
};

export const outputText = (
  sourceString: string,
  queryString: string,
): OupoutState => {
  const result = codeEvaluation(sourceString, queryString);
  if (result === null) {
    return { isArray: false, text: "" };
  }
  if (result instanceof Error) {
    return { isArray: false, text: "", errorMessage: result.message };
  }

  return { text: result, isArray: Array.isArray(jsonParseSafe(result)) };
};

export const rootReducerReset = (
  state: Readonly<RootState>,
  action: Action,
) => {
  if (action.type === "RESET_EDITOR") {
    state = initialState;
  }
  return rootReducer(state, action);
};

const rootReducers = combineReducers({
  rootReducer: rootReducerReset,
});
export default rootReducers;
