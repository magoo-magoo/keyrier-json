import { shallow } from "enzyme";
import * as React from "react";
import { OutputTable } from "./OutputTable";
import { ToggleOutputTableModal } from "../../../Actions/actions";

const dispatchMock =() => ({} as ToggleOutputTableModal) 

describe("Output", () => {
  it("renders without crashing", () => {
    shallow(<OutputTable isModalOpen={false} toggleModal={dispatchMock}/>);
  });
  it("renders a non empty array", () => {
    shallow(<OutputTable isModalOpen={false} toggleModal={dispatchMock} />);
  });
});
