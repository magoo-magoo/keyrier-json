import { shallow } from "enzyme";
import * as React from "react";
import { SourceEditor } from "./SourceEditor";

const onChangeMock = (e: string) => ({} as any);

describe("SourceEditor", () => {
  it("renders without crashing", () => {
    shallow(<SourceEditor onChange={onChangeMock} sourceText={""} />);
  });
});
