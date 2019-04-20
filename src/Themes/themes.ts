export const themeDeps = new Map<Theme, () => Promise<unknown>>()
themeDeps.set('materia', () =>
  import(/* webpackChunkName: "bootswatch/dist/materia" */ 'bootswatch/dist/materia/bootstrap.min.css')
)
themeDeps.set('darkly', () =>
  import(/* webpackChunkName: "bootswatch/dist/darkly" */ 'bootswatch/dist/darkly/bootstrap.min.css')
)
themeDeps.set('sandstone', () =>
  import(/* webpackChunkName: "bootswatch/dist/sandstone" */ 'bootswatch/dist/sandstone/bootstrap.min.css')
)
themeDeps.set('cosmo', () =>
  import(/* webpackChunkName: "bootswatch/dist/cosmo" */ 'bootswatch/dist/cosmo/bootstrap.min.css')
)
themeDeps.set('cyborg', () =>
  import(/* webpackChunkName: "bootswatch/dist/cyborg" */ 'bootswatch/dist/cyborg/bootstrap.min.css')
)
themeDeps.set('flatly', () =>
  import(/* webpackChunkName: "bootswatch/dist/flatly" */ 'bootswatch/dist/flatly/bootstrap.min.css')
)
themeDeps.set('journal', () =>
  import(/* webpackChunkName: "bootswatch/dist/journal" */ 'bootswatch/dist/journal/bootstrap.min.css')
)
themeDeps.set('litera', () =>
  import(/* webpackChunkName: "bootswatch/dist/litera" */ 'bootswatch/dist/litera/bootstrap.min.css')
)
themeDeps.set('lumen', () =>
  import(/* webpackChunkName: "bootswatch/dist/lumen" */ 'bootswatch/dist/lumen/bootstrap.min.css')
)
themeDeps.set('lux', () =>
  import(/* webpackChunkName: "bootswatch/dist/lux" */ 'bootswatch/dist/lux/bootstrap.min.css')
)
themeDeps.set('minty', () =>
  import(/* webpackChunkName: "bootswatch/dist/minty" */ 'bootswatch/dist/minty/bootstrap.min.css')
)
themeDeps.set('pulse', () =>
  import(/* webpackChunkName: "bootswatch/dist/pulse" */ 'bootswatch/dist/pulse/bootstrap.min.css')
)
themeDeps.set('simplex', () =>
  import(/* webpackChunkName: "bootswatch/dist/simplex" */ 'bootswatch/dist/simplex/bootstrap.min.css')
)
themeDeps.set('slate', () =>
  import(/* webpackChunkName: "bootswatch/dist/slate" */ 'bootswatch/dist/slate/bootstrap.min.css')
)
themeDeps.set('solar', () =>
  import(/* webpackChunkName: "bootswatch/dist/solar" */ 'bootswatch/dist/solar/bootstrap.min.css')
)
themeDeps.set('spacelab', () =>
  import(/* webpackChunkName: "bootswatch/dist/spacelab" */ 'bootswatch/dist/spacelab/bootstrap.min.css')
)
themeDeps.set('superhero', () =>
  import(/* webpackChunkName: "bootswatch/dist/superhero" */ 'bootswatch/dist/superhero/bootstrap.min.css')
)
themeDeps.set('united', () =>
  import(/* webpackChunkName: "bootswatch/dist/united" */ 'bootswatch/dist/united/bootstrap.min.css')
)
themeDeps.set('yeti', () =>
  import(/* webpackChunkName: "bootswatch/dist/yeti" */ 'bootswatch/dist/yeti/bootstrap.min.css')
)

export const importThemeStyleCustom = (theme: Theme | null) => {
  if (theme !== null) {
    const themeLoader = themeDeps.get(theme)
    if (themeLoader) {
      return themeLoader()
    }
  }
  return Promise.reject('theme is not defined')
}

export const availableThemes = [
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

export type Theme<T extends number = -1> = typeof availableThemes[T]
