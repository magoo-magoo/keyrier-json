import { combineReducers } from "redux";
import { ActionValue, updateSourceFile } from "../Actions/Actions";
import { codeEvaluation } from "../helpers/code";
import { jsonParseSafe } from "../helpers/json";
import {
  initialState,
  IOupoutState,
  IQueryState,
  IRootState,
  ISourceState
} from "../State/State";

export const rootReducer = (
  rootState: IRootState = initialState,
  action: ActionValue<any>
): IRootState => {
  const newState = {
    ...rootState,
    query: query(rootState.query, action),
    source: source(rootState.source, action)
  };

  return { ...newState, output: output(newState) };
};

export const sourceText = (
  state: ISourceState,
  action: ActionValue<string>
) => ({
  ...state,
  text: action.value
});

export const sourceFile = (
  state: ISourceState,
  action: ActionValue<string>
) => ({
  ...state,
  text: action.value
});

export const source = (state: ISourceState, action: ActionValue<any>) => {
  switch (action.type) {
    case "UPDATE_SOURCE_TEXT":
      return sourceText(state, action);
    case "UPDATE_SOURCE_FILE":
      return sourceFile(state, action);
    default:
      return state;
  }
};

export const query = (state: IQueryState, action: ActionValue<string>) => {
  switch (action.type) {
    case "UPDATE_QUERY":
      return {
        ...state,
        text: action.value
      };
    default:
      return state;
  }
};

export const output = (state: IRootState) => {
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
  state: IRootState,
  action: ActionValue<any>
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
