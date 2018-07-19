import { AnyAction, combineReducers } from "redux";
import * as actions from "./Actions";
import { IQueryState, ISourceState, IState } from "./State";
import * as defaultValues from "./values";

const initialState: IState = {
  output: { text: "" },
  query: { text: "data.colors" },
  source: { text: JSON.stringify(defaultValues.colors) }
};

const rootReducer = (
  rootState: IState = initialState,
  action: AnyAction
): IState => {
  const newState = {
    ...rootState,
    query: query(rootState.query, action),
    source: source(rootState.source, action)
  };

  return { ...newState, output: output(newState, action) };
};

const source = (state: ISourceState, action: AnyAction) => {
  switch (action.type) {
    case actions.UPDATE_SOURCE:
      return {
        ...state,
        text: action.text as string
      };
    case actions.FORMAT_SOURCE_TEXT:
      return {
        ...state,
        text: jsonBeautify(state.text)
      };
    default:
      return state;
  }
};

const jsonBeautify = (str: string) => {
  if (!str || str.trim() === "") {
    return "";
  }
  try {
    const ret = JSON.stringify(jsonParseSafe(str), null, 1);
    return ret;
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log("jsonBeautify", error.message, str);
  }
  return "";
};

const jsonParseSafe = (str: string) => {
  if (!str || str.trim() === "") {
    return "";
  }
  try {
    const ret = JSON.parse(
      str
        .replace(/\\n/g, "\\n")
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, "\\&")
        .replace(/\\r/g, "\\r")
        .replace(/\\t/g, "\\t")
        .replace(/\\b/g, "\\b")
        .replace(/\\f/g, "\\f")
        .replace(/[\u0000-\u0019]+/g, "")
    );
    return ret;
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log("jsonParseSafe", error.message, str);
  }

  return "";
};

const query = (state: IQueryState, action: AnyAction) => {
  switch (action.type) {
    case actions.UPDATE_QUERY:
      return {
        ...state,
        text: action.text as string
      };
    default:
      return state;
  }
};

const output = (state: IState, action: AnyAction) => {
  return {
    ...state.output,
    text: jsonBeautify(outputText(state.source.text, state.query.text))
  };
};

const outputText = (sourceString: string, queryString: string): string => {
  // tslint:disable-next-line:no-debugger
  if (!sourceString || sourceString.trim() === "") {
    return "";
  }

  try {
    const code = `
    const data = eval(${sourceString}) //JSON.parse('${JSON.stringify(jsonParseSafe(sourceString))}');
    console.log('PARSE SUCCESS', data)
    JSON.stringify(${queryString})
    `;
    // tslint:disable-next-line:no-console
    console.log(code);
    // tslint:disable-next-line:no-eval
    const evaluatedQuery = eval(code);
    const type = typeof evaluatedQuery;
    if (type !== "string") {
      return "";
    }
    return evaluatedQuery;
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(error.message);
    return "";
  }
};

const rootReducers = combineReducers({
  rootReducer
});
export default rootReducers;
