import "./App.css";

import * as React from "react";
import Editor from "./Editor/Editor";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Keyrier JSON</h1>
        </header>
        <Editor />
      </div>
    );
  }
}

export default App;
