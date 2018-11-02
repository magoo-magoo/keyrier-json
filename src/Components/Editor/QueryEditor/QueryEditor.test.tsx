import { shallow } from 'enzyme';
import * as React from 'react';
import { QueryEditor } from './QueryEditor';

const onChangeMock = (_: string) => ({} as any);

describe('QueryEditor', () => {
  it('renders without crashing', () => {
    shallow(<QueryEditor onChange={onChangeMock} queryText={''} />);
  });
});
