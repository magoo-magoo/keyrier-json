import "./App.css";

import * as React from "react";
import Editor from "./Editor/Editor";
import { Header } from "./Header";

export const App = () => (
  <div className="App">
    <Header />
    <div className="container">
      <Editor />
    </div>
  </div>
);

export default App;
