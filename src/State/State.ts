import { persons } from "../data/persons";
import { jsonBeautify } from "../helpers/json";

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

export interface OupoutTableState {
  readonly array: Array<{}>;
  readonly isArray: boolean;
  readonly isModalOpen: boolean;
  readonly displayedColumns: string[];
  readonly columns: string[];
  readonly groupBy: string[];
}

export interface RootState {
  readonly source: Readonly<SourceState>;
  readonly query: Readonly<QueryState>;
  readonly output: Readonly<OupoutState>;
  readonly error?: Error;
}

export interface AppState {
  readonly rootReducer: Readonly<RootState>;
}

export const initialState: Readonly<RootState> = {
  output: {
    text: "",
    table: {
      array: [],
      isArray: false,
      isModalOpen: false,
      displayedColumns: [],
      columns: [],
      groupBy: []
    }
  },
  query: {
    text: `
_.chain(data)
  .get('results')
  .filter({gender: 'male'})
  .map(d => _.pick(d, ['age', 'balance','name', 'eyeColor', 'gender', 'isActive', 'tags[0]']))
  .sortBy('balance')
    `
  },
  source: { text: JSON.stringify(persons) }
};
