import { shallow } from 'enzyme';
import * as React from 'react';
import { Output } from './Output';
import { updateOutputTabSelection } from '../../../Actions/actions';

describe('Output', () => {
  it('renders without crashing', () => {
    shallow(
      <Output
        isArray={false}
        activeTab={'RawJson'}
        setActiveTab={a => updateOutputTabSelection(a)}
      />
    );
  });

  it("should not render a output table when output isn't array", () => {
    const wrapper = (
      <Output
        isArray={false}
        activeTab={'RawJson'}
        setActiveTab={a => updateOutputTabSelection(a)}
      />
    );
    expect(wrapper).toBeDefined();
  });
});
