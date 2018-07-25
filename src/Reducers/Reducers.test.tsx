import { initialState } from "../State/State";
import rootReducers, {
  output,
  query,
  rootReducerReset,
  source
} from "./Reducers";

describe("Reducers", () => {
  it("rootReducers should run without crashing", () => {
    const results = rootReducers(undefined, { type: "" });
  });

  it("rootReducers should reset", () => {
    const state = {
      output: { text: "fake o", isArray: false },
      query: { text: "fake q" },
      source: { text: "fake s" }
    };
    const results = rootReducerReset(state, {
      type: "RESET_EDITOR",
      value: undefined
    });

    expect(results.query).toEqual(initialState.query);
    expect(results.source).toEqual(initialState.source);
    expect(results.output).not.toEqual(initialState.output);
  });

  it("update query action should update", () => {
    const state = { text: "initial" };

    const result = query(state, { value: "new value", type: "UPDATE_QUERY" });

    expect(result).toEqual({ text: "new value" });
  });

  it("update source action should update", () => {
    const state = { text: "initial" };

    const result = source(state, { value: "new value", type: "UPDATE_SOURCE" });

    expect(result).toEqual({ text: "new value" });
  });

  it("output ", () => {
    const state = {
      output: { text: "{}", isArray: false },
      query: { text: "data.value" },
      source: { text: '{"value": "test"}' }
    };

    const result = output(state);

    expect(result.text).toEqual('"test"');
    expect(result.isArray).toEqual(false);
    expect(result.errorMessage).toBeUndefined();
  });
});
