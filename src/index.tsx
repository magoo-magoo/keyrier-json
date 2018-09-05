import { Provider } from "react-redux";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { configureStore } from "./Store/store";
import * as React from "react";
import App from "./Components/App";
import * as ReactDOM from "react-dom";

// unawaited async load
import(/* webpackChunkName: "bootswatch/dist/sandstone/bootstrap.min.css" */"bootswatch/dist/sandstone/bootstrap.min.css");

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
