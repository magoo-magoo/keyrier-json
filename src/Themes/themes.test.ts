import { availableThemes, themeDeps } from './themes'

describe('Themes', () => {
  it('should have all available themes deps', () => {
    availableThemes.forEach(theme => {
      expect(themeDeps.has(theme)).toBeTruthy()
    })
  })
})
