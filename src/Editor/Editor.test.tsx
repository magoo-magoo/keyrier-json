import { shallow } from "enzyme";
import * as React from "react";
import { resetEditor } from "../Actions";
import { Editor } from "./Editor";

describe("Editor", () => {
  it("renders without crashing", () => {
    shallow(<Editor onReset={resetEditor} />);
  });
});
