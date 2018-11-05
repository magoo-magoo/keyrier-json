import * as React from 'react';
import Editor from './Editor/Editor';
import Header from './Header';

export const App = () => (
  <div className="text-center">
    <Header />
    <div className="container">
      <Editor />
    </div>
  </div>
);

export default App;
