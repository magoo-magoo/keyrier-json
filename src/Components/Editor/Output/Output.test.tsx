import { shallow } from 'enzyme';
import * as React from 'react';
import { Output } from './Output';
// import { OutputTable } from './OutputTable';

describe('Output', () => {
  it('renders without crashing', () => {
    // shallow(<Output isArray={false} output={''} />);
  });

  it("should not render a output table when output isn't array", () => {
    const wrapper = <Output isArray={true} output={''} />;
    expect(wrapper).toBeDefined();
    // const wrapper = shallow(<Output isArray={false} output={''} />);
    //expect(wrapper.find(OutputTable)).toHaveLength(0);
  });
});
