import { shallow } from 'enzyme';
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./Store";

describe("App", () => {
  it("renders without crashing", () => {
    shallow(<App />);
  });
});
