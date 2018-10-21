import { persons } from "../data/persons";

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

export interface RootState {
  readonly source: Readonly<SourceState>;
  readonly query: Readonly<QueryState>;
  readonly output: Readonly<OupoutState>;
  readonly error?: Error;
}

export interface AppState {
  readonly rootReducer: Readonly<RootState>;
}

const initialState: Readonly<RootState> = {
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
// data is your JSON object
// you can use any correct javascript code to query it
// in addition of that,
// you can use lodash helper functions like exemple below. see https://lodash.com/docs/
_.chain(data)
  .get('results')
    `
  },
  source: { text: JSON.stringify(persons) }
};

export const getInitialState = () => initialState;
