import * as React from 'react';
import { Editor } from './Editor';
import { create as render } from 'react-test-renderer';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

describe('Editor', () => {
  const mockStore = configureStore([])();

  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <Editor />
      </Provider>
    );
  });
});
