import { combineReducers } from "redux";
import { ActionValue } from "./Actions";
import { jsonBeautify, jsonParseSafe } from "./helpers/json";
import {
  initialState,
  IOupoutState,
  IQueryState,
  IRootState,
  ISourceState
} from "./State";

const rootReducer = (
  rootState: IRootState = initialState,
  action: ActionValue<string>
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
  if (!sourceString || sourceString.trim() === "") {
    return { isArray: false, text: "" };
  }

  try {
    const code = `
    const data = eval(${sourceString}) //JSON.parse('${JSON.stringify(
      jsonParseSafe(sourceString)
    )}');

    JSON.stringify(${queryString})
    `;
    // tslint:disable-next-line:no-eval
    const evaluatedQuery = eval(code);
    const type = typeof evaluatedQuery;
    if (type !== "string") {
      return { isArray: false, text: "" };
    }
    return {
      isArray: Array.isArray(jsonParseSafe(evaluatedQuery)),
      text: evaluatedQuery
    };
  } catch (error) {
    return { errorMessage: error.message, isArray: false, text: "" };
  }
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
