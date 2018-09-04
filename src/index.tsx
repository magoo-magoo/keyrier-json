import "bootstrap/dist/css/bootstrap.min.css";

import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { configureStore } from "./Store/store";
import * as React from "react";
import App from "./Components/App";

const start = async () => {
  const store = await configureStore();
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root") as HTMLElement
  );
  registerServiceWorker();
};

start();