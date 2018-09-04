import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";

import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import store from "./Store/store";
import * as React from "react";
import App from "./Components/App";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
