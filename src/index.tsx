import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table/react-table.css'

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './Components/App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import store from './Store/Store';

ReactDOM.render(
  <Provider store={store}>
  <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
