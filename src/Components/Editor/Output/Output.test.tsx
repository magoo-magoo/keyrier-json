import { shallow } from "enzyme";
import * as React from "react";
import { Output } from "./Output";

describe("Output", () => {
  it("renders without crashing", () => {
    shallow(<Output isArray={false} output={""} />);
  });
});
