const map = new Map<Theme, () => Promise<any>>();
map.set('materia', () => import('bootswatch/dist/materia/bootstrap.min.css'));
map.set('darkly', () => import('bootswatch/dist/darkly/bootstrap.min.css'));
map.set('sandstone', () =>
  import('bootswatch/dist/sandstone/bootstrap.min.css')
);
map.set('cosmo', () => import('bootswatch/dist/cosmo/bootstrap.min.css'));
map.set('cyborg', () => import('bootswatch/dist/cyborg/bootstrap.min.css'));
map.set('flatly', () => import('bootswatch/dist/flatly/bootstrap.min.css'));
map.set('journal', () => import('bootswatch/dist/journal/bootstrap.min.css'));
map.set('litera', () => import('bootswatch/dist/litera/bootstrap.min.css'));
map.set('lumen', () => import('bootswatch/dist/lumen/bootstrap.min.css'));
map.set('lux', () => import('bootswatch/dist/lux/bootstrap.min.css'));
map.set('minty', () => import('bootswatch/dist/minty/bootstrap.min.css'));
map.set('pulse', () => import('bootswatch/dist/pulse/bootstrap.min.css'));
map.set('simplex', () => import('bootswatch/dist/simplex/bootstrap.min.css'));
map.set('slate', () => import('bootswatch/dist/slate/bootstrap.min.css'));
map.set('solar', () => import('bootswatch/dist/solar/bootstrap.min.css'));
map.set('spacelab', () => import('bootswatch/dist/spacelab/bootstrap.min.css'));
map.set('superhero', () =>
  import('bootswatch/dist/superhero/bootstrap.min.css')
);
map.set('united', () => import('bootswatch/dist/united/bootstrap.min.css'));
map.set('yeti', () => import('bootswatch/dist/yeti/bootstrap.min.css'));

export const importThemeStyleCustom = (theme: Theme) => {
  const themeLoader = map.get(theme);
  if (themeLoader) {
    return themeLoader();
  }
  return Promise.reject('theme is not defined');
};

export type Theme =
  | 'materia'
  | 'darkly'
  | 'sandstone'
  | 'cosmo'
  | 'cyborg'
  | 'flatly'
  | 'journal'
  | 'litera'
  | 'lumen'
  | 'lux'
  | 'minty'
  | 'pulse'
  | 'simplex'
  | 'slate'
  | 'solar'
  | 'spacelab'
  | 'superhero'
  | 'united'
  | 'yeti';
