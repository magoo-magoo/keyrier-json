import * as React from 'react'
import Editor from './Editor/Editor'
import Header from './Header'
import { ToastContainer } from 'react-toastify'

export const App = () => (
  <div>
    <Header />
    <div className="container">
      <Editor />
    </div>
    <ToastContainer />
  </div>
)

export default App
