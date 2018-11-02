import { AppState } from '../State/State';

type selector<T> = (state: Readonly<AppState>) => T;

export const getOutputErrorMessage: selector<string | undefined> = (
  state: Readonly<AppState>
) => state.rootReducer.output.errorMessage;

export const getOutputIsArray: selector<boolean> = state =>
  state.rootReducer.output.table.isArray;

export const getOutputText = (state: Readonly<AppState>) =>
  state.rootReducer.output.text;

export const getOutputTableData = (state: Readonly<AppState>) =>
  state.rootReducer.output.table.array;

export const getisOutputTableModalOpen = (state: Readonly<AppState>) =>
  state.rootReducer.output.table.isModalOpen;
