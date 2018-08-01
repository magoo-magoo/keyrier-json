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
  isArray: boolean;
  errorMessage?: string;
}

export interface RootState {
  source: SourceState;
  query: QueryState;
  output: OupoutState;
}

export interface AppState {
  rootReducer: RootState;
}

export const initialState: RootState = {
  output: { text: "", isArray: false },
  query: {
    text: `
_.chain(data)
  .get('results')
  .filter({gender: 'male'})
  .map(d => _.pick(d, ['age', 'balance','name', 'eyeColor', 'gender', 'isActive', 'tags[0]']))
  .sortBy('balance')
    `,
  },
  source: { text: JSON.stringify(persons) },
};
