import { availableGeneralThemes, importThemeStyleCustom, themeDeps } from './themes'

describe('Themes', () => {
    it('should have all available themes deps', async () => {
        availableGeneralThemes.forEach((theme) => {
            expect(themeDeps.has(theme)).toBeTruthy()
        })
        for (const theme of availableGeneralThemes) {
            const style = await importThemeStyleCustom(theme)
            expect(style).toBeDefined()
        }
    })
})
