import * as React from 'react'
import { shallow } from 'enzyme'
import RequestSource from './RequestSource'

const onChangeMock = () => {
  //
}
describe('RequestSource', () => {
  it('renders without crashing', () => {
    shallow(<RequestSource onRequestSucceed={onChangeMock} />)
  })
})
