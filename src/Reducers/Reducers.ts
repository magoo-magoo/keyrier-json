import { combineReducers } from "redux";
import { Action,  IUpdateSource } from "../Actions/Actions";
import { codeEvaluation } from "../helpers/code";
import { jsonParseSafe } from "../helpers/json";
import { initialState, IOupoutState, IQueryState, IRootState, ISourceState } from "../State/State";

export const rootReducer = (
  rootState: Readonly<IRootState> = initialState,
  action: Action
): IRootState => {
  const newState = {
    ...rootState,
    query: query(rootState.query, action),
    source: source(rootState.source, action)
  };

  return { ...newState, output: output(newState) };
};

export const sourceText = (
  state: Readonly<ISourceState>,
  action: IUpdateSource
) => ({
  ...state,
  text: action.source
});

export const source = (state: Readonly<ISourceState>, action: Action) => {
  switch (action.type) {
    case "UPDATE_SOURCE_TEXT":
      return sourceText(state, action);
    default:
      return state;
  }
};

export const query = (state: Readonly<IQueryState>, action: Action) => {
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

export const output = (state: Readonly<IRootState>) => {
  const newOutputState = outputText(state.source.text, state.query.text);
  return {
    ...state.output,
    errorMessage: newOutputState.errorMessage,
    isArray: newOutputState.isArray,
    text: newOutputState.text
  };
};

export const outputText = (
  sourceString: string,
  queryString: string
): IOupoutState => {
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
  state: Readonly<IRootState>,
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
