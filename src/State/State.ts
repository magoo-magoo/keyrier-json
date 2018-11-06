import initialStateJson from './default-state.json';
import { Theme } from '../Themes/themes';

export interface QueryState {
  readonly text: string;
}

export interface SourceState {
  readonly text: string;
}

export interface OupoutState {
  readonly text: string;
  readonly errorMessage?: string;
  readonly table: Readonly<OupoutTableState>;
}

export type itemType =
  | null
  | undefined
  | string
  | boolean
  | number
  | never
  | any;

export interface OupoutTableState {
  readonly array: itemType[];
  readonly isArray: boolean;
  readonly isModalOpen: boolean;
  readonly displayedColumns: string[];
  readonly columns: string[];
  readonly groupBy: string[];
}

export interface UserSettingsState {
  readonly globalTheme: Theme | string;
}

export interface RootState {
  readonly source: Readonly<SourceState>;
  readonly query: Readonly<QueryState>;
  readonly output: Readonly<OupoutState>;
  readonly userSettings: Readonly<UserSettingsState>;
  readonly error?: Error;
}

export interface AppState {
  readonly rootReducer: Readonly<RootState>;
}

export const getInitialState = () => initialStateJson;
