import * as React from "react";

// tslint:disable-next-line:no-var-requires
const Loadable: LoadableExport.Loadable = require("react-loadable");


export const LoadableReactSelect = Loadable({
  loading: () => <div>Loading...</div>,
  loader: () => import(/* webpackChunkName: "react-select" */ "react-select"),
  render: (loaded, props) => {
    const Component = loaded.default;
    return <Component {...props} />;
  }
});
