import initialStateJson from './default-state.json';
import { Theme } from '../Themes/themes.js';

export interface QueryState {
  readonly text: string;
}

export interface SourceState {
  readonly text: string;
}

export interface OupoutState {
  readonly text: string;
  readonly searchTerm: string;
  readonly match: boolean;
  readonly obj: object | null;
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
  readonly globalTheme: Theme | null;
}

export interface AppState {
  readonly source: Readonly<SourceState>;
  readonly query: Readonly<QueryState>;
  readonly output: Readonly<OupoutState>;
  readonly error?: Error;
}

export interface RootState {
  readonly app: Readonly<AppState> | undefined;
  readonly userSettings: Readonly<UserSettingsState> | undefined;
}

export const getInitialAppState = () => initialStateJson as AppState;
export const getInitialUserSettingsState = () =>
  ({
    globalTheme: 'materia',
  } as UserSettingsState);
