import * as React from "react";
import "react-table/react-table.css";

// tslint:disable-next-line:no-var-requires
const Loadable: LoadableExport.Loadable = require("react-loadable");


export const LoadableReactTable = Loadable({
  loading: () => <div>Loading...</div>,
  loader: () => import(/* webpackChunkName: "react-table" */ "react-table"),
  render: (loaded, props) => {
    const Component = loaded.default;
    return <Component {...props} />;
  }
});
