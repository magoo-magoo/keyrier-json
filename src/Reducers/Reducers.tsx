import { combineReducers } from "redux";
import { ActionValue } from "../Actions/Actions";
import { codeEvaluation } from "../helpers/code";
import { jsonBeautify, jsonParseSafe } from "../helpers/json";
import {
  initialState,
  IOupoutState,
  IQueryState,
  IRootState,
  ISourceState
} from "../State/State";

const rootReducer = (
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

const source = (state: ISourceState, action: ActionValue<string>) => {
  switch (action.type) {
    case "UPDATE_SOURCE":
      return {
        ...state,
        text: jsonBeautify(action.value)
      };
    default:
      return state;
  }
};

const query = (state: IQueryState, action: ActionValue<string>) => {
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

const output = (state: IRootState) => {
  const newOutputState = outputText(state.source.text, state.query.text);
  return {
    ...state.output,
    errorMessage: newOutputState.errorMessage,
    isArray: newOutputState.isArray,
    text: jsonBeautify(newOutputState.text)
  };
};

const outputText = (
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

const rootReducerReset = (state: IRootState, action: ActionValue<string>) => {
  if (action.type === "RESET_EDITOR") {
    state = initialState;
  }
  return rootReducer(state, action);
};

const rootReducers = combineReducers({
  rootReducer: rootReducerReset
});
export default rootReducers;
