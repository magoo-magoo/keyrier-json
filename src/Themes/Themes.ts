export type Theme = 'materia' | 'darkly' | 'sandstone' | 'sketchy';

export const importThemeStyle = (theme: Theme) => {
  switch (theme) {
    case 'materia':
      return import('bootswatch/dist/materia/bootstrap.min.css');
    case 'darkly':
      return import('bootswatch/dist/darkly/bootstrap.min.css');
    case 'sandstone':
      return import('bootswatch/dist/sandstone/bootstrap.min.css');
    case 'sketchy':
      return import('bootswatch/dist/sketchy/bootstrap.min.css');
    default:
      return import('bootswatch/dist/materia/bootstrap.min.css');
  }
};
