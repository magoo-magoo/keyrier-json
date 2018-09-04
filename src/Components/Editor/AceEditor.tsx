import * as React from "react";

// tslint:disable-next-line:no-var-requires
const Loadable:LoadableExport.Loadable = require('react-loadable');

const modulesPromise = import(/* webpackChunkName: "react-ace" */ "react-ace").then(module =>
  Promise.all([
    import(/* webpackChunkName: "brace/theme/monokai" */"brace/theme/monokai"),
    import(/* webpackChunkName: "brace/theme/github" */"brace/theme/github"),
    import(/* webpackChunkName: "brace/mode/json" */"brace/mode/json"),
    import(/* webpackChunkName: "brace/mode/javascript" */"brace/mode/javascript")
  ]).then(_ => module)
);

export const LoadableAce = Loadable({
  loading: () => <div>Loading...</div>,
  loader: () => modulesPromise,
  render: (loaded, props) => {
    const Component = loaded.default;
    return <Component {...props} />;
  }
});
