import { shallow } from "enzyme";
import * as React from "react";
import { OutputTable } from "./OutputTable";

describe("Output", () => {
  it("renders without crashing", () => {
    shallow(<OutputTable data={[]} />);
  });
  it("renders a non empty array", () => {
    shallow(<OutputTable data={[{ stuff: 1, foo: "bar" }]} />);
  });
});
