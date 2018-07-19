import * as React from "react";
import * as ReactDOM from "react-dom";
import QueryEditor from "./QueryEditor";

describe("QueryEditor", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<QueryEditor />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
