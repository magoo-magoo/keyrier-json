import { logError } from '../core/logging/logger'

export const themeDeps = new Map([
    ['materia', () => import(/* webpackChunkName: "bootswatch/dist/materia" */ 'bootswatch/dist/materia/bootstrap.min.css')],
    ['darkly', () => import(/* webpackChunkName: "bootswatch/dist/darkly" */ 'bootswatch/dist/darkly/bootstrap.min.css')],
    ['sandstone', () => import(/* webpackChunkName: "bootswatch/dist/sandstone" */ 'bootswatch/dist/sandstone/bootstrap.min.css')],
    ['cosmo', () => import(/* webpackChunkName: "bootswatch/dist/cosmo" */ 'bootswatch/dist/cosmo/bootstrap.min.css')],
    ['cyborg', () => import(/* webpackChunkName: "bootswatch/dist/cyborg" */ 'bootswatch/dist/cyborg/bootstrap.min.css')],
    ['flatly', () => import(/* webpackChunkName: "bootswatch/dist/flatly" */ 'bootswatch/dist/flatly/bootstrap.min.css')],
    ['journal', () => import(/* webpackChunkName: "bootswatch/dist/journal" */ 'bootswatch/dist/journal/bootstrap.min.css')],
    ['litera', () => import(/* webpackChunkName: "bootswatch/dist/litera" */ 'bootswatch/dist/litera/bootstrap.min.css')],
    ['lumen', () => import(/* webpackChunkName: "bootswatch/dist/lumen" */ 'bootswatch/dist/lumen/bootstrap.min.css')],
    ['lux', () => import(/* webpackChunkName: "bootswatch/dist/lux" */ 'bootswatch/dist/lux/bootstrap.min.css')],
    ['minty', () => import(/* webpackChunkName: "bootswatch/dist/minty" */ 'bootswatch/dist/minty/bootstrap.min.css')],
    ['pulse', () => import(/* webpackChunkName: "bootswatch/dist/pulse" */ 'bootswatch/dist/pulse/bootstrap.min.css')],
    ['simplex', () => import(/* webpackChunkName: "bootswatch/dist/simplex" */ 'bootswatch/dist/simplex/bootstrap.min.css')],
    ['slate', () => import(/* webpackChunkName: "bootswatch/dist/slate" */ 'bootswatch/dist/slate/bootstrap.min.css')],
    ['solar', () => import(/* webpackChunkName: "bootswatch/dist/solar" */ 'bootswatch/dist/solar/bootstrap.min.css')],
    ['spacelab', () => import(/* webpackChunkName: "bootswatch/dist/spacelab" */ 'bootswatch/dist/spacelab/bootstrap.min.css')],
    ['superhero', () => import(/* webpackChunkName: "bootswatch/dist/superhero" */ 'bootswatch/dist/superhero/bootstrap.min.css')],
    ['united', () => import(/* webpackChunkName: "bootswatch/dist/united" */ 'bootswatch/dist/united/bootstrap.min.css')],
    ['yeti', () => import(/* webpackChunkName: "bootswatch/dist/yeti" */ 'bootswatch/dist/yeti/bootstrap.min.css')],
] as const)

export const importThemeStyleCustom = (theme: GeneralTheme | null) => {
    if (theme) {
        const themeLoader = themeDeps.get(theme)
        if (themeLoader) {
            return themeLoader()
        }
    }

    logError(`${theme}: theme is not defined`)

    return themeDeps.values().next().value()
}

export const availableGeneralThemes = [
    'materia',
    'darkly',
    'sandstone',
    'cosmo',
    'cyborg',
    'flatly',
    'journal',
    'litera',
    'lumen',
    'lux',
    'minty',
    'pulse',
    'simplex',
    'slate',
    'solar',
    'spacelab',
    'superhero',
    'united',
    'yeti',
] as const
export type GeneralTheme = typeof availableGeneralThemes[number]

export const availableEditorThemes = ['github', 'monokai', 'tomorrow', 'solarized_dark', 'terminal'] as const
export type EditorTheme = typeof availableEditorThemes[number]
