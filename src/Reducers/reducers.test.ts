import {
  output,
  query,
  rootReducerReset,
  source
} from "./reducers";
import { getInitialState } from "../State/State";

describe("Reducers", () => {

  it("rootReducers should reset", () => {
    const state = {
      output: {
        text: "fake o",
        table: {
          array: [],
          isArray: false,
          isModalOpen: false,
          displayedColumns: [],
          columns: [],
          groupBy: []
        }
      },
      query: { text: "fake q" },
      source: { text: "fake s" }
    };
    const results = rootReducerReset(state, {
      type: "RESET_EDITOR"
    });

    expect(results.query).toEqual(getInitialState().query);
    expect(results.source).toEqual(getInitialState().source);
  });

  it("update query action should update", () => {
    const state = { text: "initial" };

    const result = query(state, { query: "new value", type: "UPDATE_QUERY" });

    expect(result).toEqual({ text: "new value" });
  });

  it("update source action should update", () => {
    const state = { text: "initial" };

    const result = source(state, {
      source: "new value",
      type: "UPDATE_SOURCE_TEXT"
    });

    expect(result).toEqual({ text: "new value" });
  });

  it("output ", () => {
    const state = {
      output: {
        text: "{}",
        table: {
          array: [],
          isArray: false,
          isModalOpen: false,
          displayedColumns: [],
          columns: [],
          groupBy: []
        }
      },
      query: { text: "data.value" },
      source: { text: '{"value": "test"}' }
    };

    const result = output(state.output, state.source.text, state.query.text, {
      type: "EVALUATE_CODE"
    });

    expect(result.text).toEqual('"test"');
    expect(result.table.isArray).toEqual(false);
    expect(result.errorMessage).toBeUndefined();
  });
});
