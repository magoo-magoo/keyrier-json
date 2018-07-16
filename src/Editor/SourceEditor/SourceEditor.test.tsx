import * as React from "react";
import * as ReactDOM from "react-dom";
import SourceEditor from "./SourceEditor";

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SourceEditor />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
  