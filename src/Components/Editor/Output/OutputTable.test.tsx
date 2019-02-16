import { shallow } from 'enzyme'
import * as React from 'react'
import OutputTable from './OutputTable'

describe('Output', () => {
  it('renders without crashing', () => {
    shallow(<OutputTable />)
  })
  it('renders a non empty array', () => {
    shallow(<OutputTable />)
  })
})
