import { persons } from "../data/persons";
import { jsonBeautify } from "../helpers/json";

export interface QueryState {
  text: string;
}

export interface SourceState {
  text: string;
}

export interface OupoutState {
  text: string;
  errorMessage?: string;
  table: Readonly<OupoutTableState>;
}

export interface OupoutTableState {
  array: Array<{}>;
  isArray: boolean;
  isModalOpen: boolean;
  displayedColumns: string[];
  columns: string[];
  groupBy: string[];
}

export interface RootState {
  source: Readonly<SourceState>;
  query: Readonly<QueryState>;
  output: Readonly<OupoutState>;
}

export interface AppState {
  rootReducer: Readonly<RootState>;
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
