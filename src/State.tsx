import { persons } from "./data/persons";
import { jsonBeautify } from "./helpers/json";

export interface IQueryState {
  text: string;
}

export interface ISourceState {
  text: string;
}

export interface IOupoutState {
  text: string;
  isArray: boolean;
  errorMessage?: string;
}

export interface IRootState {
  source: ISourceState;
  query: IQueryState;
  output: IOupoutState;
}

export interface IAppState {
    rootReducer : IRootState;
}


export const initialState: IRootState = {
    output: { text: "", isArray: false },
    query: {
      text: `
      _.chain(data)
      .get('results')
      .filter({gender: 'male'})
      .map(d => _.pick(d, ['age', 'balance','name', 'eyeColor', 'gender', 'isActive', 'tags[0]']))
    `
    },
    source: { text:jsonBeautify(JSON.stringify(persons)) }
  };
  