import { Loading } from "./Loading";

// tslint:disable-next-line:no-var-requires
const Loadable: LoadableExport.Loadable = require("react-loadable");

const loadAceEditor = async () => {
  const aceEditor = await import(/* webpackChunkName: "react-ace" */ "react-ace");
  await Promise.all([
    import(/* webpackChunkName: "brace/theme/monokai" */ "brace/theme/monokai"),
    import(/* webpackChunkName: "brace/theme/github" */ "brace/theme/github"),
    import(/* webpackChunkName: "brace/mode/json" */ "brace/mode/json"),
    import(/* webpackChunkName: "brace/mode/javascript" */ "brace/mode/javascript")
  ]);
  return aceEditor;
};

export const AceEditor = Loadable({
  loading: Loading("AceEditor"),
  loader: loadAceEditor
});
