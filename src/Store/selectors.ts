import { RootState } from '../State/State';

type selector<T> = (state: Readonly<RootState>) => T;

export const getOutputErrorMessage: selector<string | undefined> = (
  state: Readonly<RootState>
) => (state.app ? state.app.output.errorMessage : '');

export const getOutputIsArray: selector<boolean> = state =>
  state.app ? state.app.output.table.isArray : false;

export const getOutputText = (state: Readonly<RootState>) =>
  state.app ? state.app.output.text : '';
export const getOutputObject = (state: Readonly<RootState>) =>
  state.app ? state.app.output.obj : {};
export const getOutputSearchTerm = (state: Readonly<RootState>) =>
  state.app ? state.app.output.searchTerm : '';
export const getOutputSearchMatch = (state: Readonly<RootState>) =>
  state.app ? state.app.output.match : false;

export const getOutputTableData = (state: Readonly<RootState>) =>
  state.app ? state.app.output.table.array : [];

export const getisOutputTableModalOpen = (state: Readonly<RootState>) =>
  state.app ? state.app.output.table.isModalOpen : false;

export const getTheme = (state: Readonly<RootState>) => {
  if (state.userSettings) {
    return state.userSettings.globalTheme;
  }
  return null;
};

export const getdisplayedColumns = (state: Readonly<RootState>) =>
  state.app ? state.app.output.table.displayedColumns : [];
export const getTableArray = (state: Readonly<RootState>) =>
  state.app ? state.app.output.table.array : [];
export const getColumns = (state: Readonly<RootState>) =>
  state.app ? state.app.output.table.columns : [];
export const getGroupBy = (state: Readonly<RootState>) =>
  state.app ? state.app.output.table.groupBy : [];

export const getQueryText = (state: Readonly<RootState>) =>
  state.app ? state.app.query.text : '';
export const getSourceText = (state: Readonly<RootState>) =>
  state.app ? state.app.source.text : '';
