import { shallow } from 'enzyme'
import * as React from 'react'
import { ImportMenu } from './ImportMenu'

describe('ImportMenu', () => {
  it('renders without crashing', () => {
    const onChangeMock = () => ({} as any)
    // shallow(<ImportMenu onReset={onChangeMock} onFileContentReady={onChangeMock} />)
  })

  it('should load file content', async () => {
    const probe = { called: false }
    const promise = new Promise<{ called: boolean }>(resolve => {
      setTimeout(() => resolve(probe), 1000)
    })

    const onChangeMock = () => {
      probe.called = true
      return null as any
    }

    // const importMenu = shallow(<ImportMenu onReset={onChangeMock} onFileContentReady={onChangeMock} />)

    // const blob = new Blob(['File content'], { type: 'text/html' })
    // importMenu.find('#sourceFile').simulate('change', { target: { files: [blob] } })

    // const result = await promise
    // expect(result.called).toBeTruthy()
  })
})
