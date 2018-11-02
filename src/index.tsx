import { Provider } from 'react-redux';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './Store/store';
import * as React from 'react';
import App from './Components/App';
import(/* webpackChunkName: "bootswatch/dist/sandstone/bootstrap.min.css" */ 'bootswatch/dist/sandstone/bootstrap.min.css');

const start = async () => {
  const promises = await Promise.all([
    configureStore(),
    import(/* webpackChunkName: "react-dom" */ 'react-dom'),
    import(/* webpackChunkName: "lodash" */ 'lodash'),
  ]);

  const store = promises['0'];
  const ReactDOM = promises['1'];

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root') as HTMLElement
  );

  registerServiceWorker();

  require('react-loadable').preloadAll();
};

start();
