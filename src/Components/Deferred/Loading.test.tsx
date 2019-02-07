import { Loading } from './Loading'

describe('Loading', () => {
  it('renders without crashing', () => {
    const r = Loading('toto')({} as any)
    expect(r).toBeDefined()
  })
})
