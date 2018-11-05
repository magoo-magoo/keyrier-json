import { Provider } from 'react-redux';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { configureStore } from './Store/store';
import * as React from 'react';
import App from './Components/App';
import { importThemeStyle } from './Themes/Themes';
import { getTheme } from './Store/selectors';

importThemeStyle('materia');

const start = async () => {
  const promises = await Promise.all([
    configureStore(),
    import(/* webpackChunkName: "react-dom" */ 'react-dom'),
    import(/* webpackChunkName: "lodash" */ 'lodash'),
  ]);

  const store = promises[0];
  const ReactDOM = promises[1];
  const state = store.getState() as any;
  importThemeStyle(getTheme(state));
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
