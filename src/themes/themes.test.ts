import { availableGeneralThemes, themeDeps, editorThemeDeps, availableEditorThemes } from './themes'

describe('Themes', () => {
    it('should have all available themes deps', () => {
        availableGeneralThemes.forEach(theme => {
            expect(themeDeps.has(theme)).toBeTruthy()
        })
    })
})
